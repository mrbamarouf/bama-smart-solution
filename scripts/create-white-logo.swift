import CoreGraphics
import Foundation
import ImageIO
import UniformTypeIdentifiers

struct Raster {
  let width: Int
  let height: Int
  var pixels: [UInt8]
}

guard CommandLine.arguments.count == 3 else {
  fputs("Usage: create-white-logo.swift <input.png> <output.png>\n", stderr)
  exit(2)
}

let inputURL = URL(fileURLWithPath: CommandLine.arguments[1])
let outputURL = URL(fileURLWithPath: CommandLine.arguments[2])
let colorSpace = CGColorSpace(name: CGColorSpace.sRGB)!
let bitmapInfo = CGBitmapInfo(rawValue: CGImageAlphaInfo.premultipliedLast.rawValue)

func loadRaster(at url: URL) -> Raster? {
  guard
    let source = CGImageSourceCreateWithURL(url as CFURL, nil),
    let image = CGImageSourceCreateImageAtIndex(source, 0, nil)
  else { return nil }

  let width = image.width
  let height = image.height
  var pixels = [UInt8](repeating: 0, count: width * height * 4)
  guard let context = CGContext(
    data: &pixels,
    width: width,
    height: height,
    bitsPerComponent: 8,
    bytesPerRow: width * 4,
    space: colorSpace,
    bitmapInfo: bitmapInfo.rawValue
  ) else { return nil }

  context.draw(image, in: CGRect(x: 0, y: 0, width: width, height: height))
  return Raster(width: width, height: height, pixels: pixels)
}

func removeSmallAlphaComponents(from source: Raster, minimumPixelCount: Int) -> (Raster, Int) {
  var raster = source
  var visited = [Bool](repeating: false, count: source.width * source.height)
  var removedPixels = 0

  for origin in visited.indices {
    guard !visited[origin], source.pixels[origin * 4 + 3] > 0 else {
      visited[origin] = true
      continue
    }

    var component = [origin]
    var cursor = 0
    visited[origin] = true

    while cursor < component.count {
      let position = component[cursor]
      cursor += 1
      let x = position % source.width
      let y = position / source.width

      for deltaY in -1...1 {
        for deltaX in -1...1 where deltaX != 0 || deltaY != 0 {
          let nextX = x + deltaX
          let nextY = y + deltaY
          guard
            nextX >= 0,
            nextX < source.width,
            nextY >= 0,
            nextY < source.height
          else { continue }

          let next = nextY * source.width + nextX
          guard !visited[next], source.pixels[next * 4 + 3] > 0 else { continue }
          visited[next] = true
          component.append(next)
        }
      }
    }

    guard component.count < minimumPixelCount else { continue }
    removedPixels += component.count
    for position in component {
      let byte = position * 4
      raster.pixels[byte] = 0
      raster.pixels[byte + 1] = 0
      raster.pixels[byte + 2] = 0
      raster.pixels[byte + 3] = 0
    }
  }

  return (raster, removedPixels)
}

func writePNG(_ raster: Raster, to url: URL) -> Bool {
  let data = Data(raster.pixels) as CFData
  guard
    let provider = CGDataProvider(data: data),
    let image = CGImage(
      width: raster.width,
      height: raster.height,
      bitsPerComponent: 8,
      bitsPerPixel: 32,
      bytesPerRow: raster.width * 4,
      space: colorSpace,
      bitmapInfo: bitmapInfo,
      provider: provider,
      decode: nil,
      shouldInterpolate: false,
      intent: .defaultIntent
    ),
    let destination = CGImageDestinationCreateWithURL(
      url as CFURL,
      UTType.png.identifier as CFString,
      1,
      nil
    )
  else { return false }

  CGImageDestinationAddImage(destination, image, nil)
  return CGImageDestinationFinalize(destination)
}

guard let approved = loadRaster(at: inputURL) else {
  fputs("Unable to read input image.\n", stderr)
  exit(3)
}

let normalized = removeSmallAlphaComponents(from: approved, minimumPixelCount: 64)
var white = normalized.0

for pixel in 0..<(white.width * white.height) {
  let byte = pixel * 4
  let alpha = white.pixels[byte + 3]
  white.pixels[byte] = alpha
  white.pixels[byte + 1] = alpha
  white.pixels[byte + 2] = alpha
}

guard writePNG(white, to: outputURL), let written = loadRaster(at: outputURL) else {
  fputs("Unable to write output image.\n", stderr)
  exit(4)
}

let expectedAlpha = stride(from: 3, to: white.pixels.count, by: 4).map { white.pixels[$0] }
let writtenAlpha = stride(from: 3, to: written.pixels.count, by: 4).map { written.pixels[$0] }

guard
  white.width == written.width,
  white.height == written.height,
  expectedAlpha == writtenAlpha
else {
  fputs("Output alpha geometry does not match the cleaned approved source.\n", stderr)
  exit(5)
}

print(
  "Created \(outputURL.path) at \(white.width)x\(white.height); " +
  "removed \(normalized.1) isolated extraction-noise pixels."
)
