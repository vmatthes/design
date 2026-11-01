package com.volkermatthes.designkit

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Fill
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.scale
import androidx.compose.ui.graphics.drawscope.translate
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

/**
 * A sticker motif: ink outline, white details, the rest in [color]. [dieCut]
 * cuts it out along the shape, with a white edge that follows the motif.
 */
@Composable
fun StickerImage(sticker: Sticker, color: Color, modifier: Modifier = Modifier, size: Dp = 40.dp, dieCut: Boolean = false) {
  val layers = StickerLayer.of(sticker)
  Canvas(modifier.size(size)) {
    val factor = this.size.width / StickerLayer.VIEW_BOX
    scale(factor, pivot = Offset.Zero) {
      translate(4f, 4f) {
        if (dieCut) {
          for (layer in layers) {
            drawPath(
              layer.path,
              Color.White,
              style = Stroke(layer.width + 2 * StickerLayer.DIE_CUT_EDGE, cap = StrokeCap.Round, join = StrokeJoin.Round),
            )
            if (layer.fill != StickerLayer.Paint.None) drawPath(layer.path, Color.White, style = Fill)
          }
        }
        for (layer in layers) {
          layer.fill.color(color)?.let { drawPath(layer.path, it, style = Fill) }
          layer.stroke.color(color)?.let {
            drawPath(
              layer.path,
              it,
              style = Stroke(
                layer.width,
                cap = StrokeCap.Round,
                join = StrokeJoin.Round,
                pathEffect = layer.dash.takeIf { dash -> dash.isNotEmpty() }?.let { dash -> PathEffect.dashPathEffect(dash) },
              ),
            )
          }
        }
      }
    }
  }
}

internal class StickerLayer(line: String) {
  enum class Paint {
    None, Accent, White, Ink, Dim;

    /** Ink and white stay the same in both themes, like the printed sticker. */
    fun color(accent: Color): Color? = when (this) {
      None -> null
      Accent -> accent
      White -> Color.White
      Ink -> Color(0xFF1A1A1A)
      Dim -> Color(0xFF4A4A46)
    }

    companion object {
      fun of(code: String) = when (code) {
        "c" -> Accent
        "w" -> White
        "i" -> Ink
        "d" -> Dim
        else -> None
      }
    }
  }

  val fill: Paint
  val stroke: Paint
  val width: Float
  val dash: FloatArray
  val path: Path

  init {
    val parts = line.split("|")
    fill = Paint.of(parts[0])
    stroke = Paint.of(parts[1])
    width = parts[2].toFloatOrNull() ?: 0f
    dash = parts[3].split(" ").mapNotNull { it.toFloatOrNull() }.toFloatArray()
    path = parse(parts[4])
  }

  /** Reads the absolute M, L, Q, C and Z commands the generator writes. */
  private fun parse(data: String): Path {
    val path = Path()
    val tokens = data.split(" ").filter { it.isNotEmpty() }
    var index = 0
    fun next() = tokens[index++].toFloatOrNull() ?: 0f
    while (index < tokens.size) {
      when (tokens[index++]) {
        "M" -> path.moveTo(next(), next())
        "L" -> path.lineTo(next(), next())
        "Q" -> path.quadraticTo(next(), next(), next(), next())
        "C" -> path.cubicTo(next(), next(), next(), next(), next(), next())
        else -> path.close()
      }
    }
    return path
  }

  companion object {
    const val VIEW_BOX = 72f
    const val DIE_CUT_EDGE = 3.4f
    private val cache = mutableMapOf<Sticker, List<StickerLayer>>()

    /** Parsed once; the generated source is compact text. */
    fun of(sticker: Sticker): List<StickerLayer> = synchronized(cache) {
      cache.getOrPut(sticker) { sticker.source.split("\n").filter { it.isNotEmpty() }.map(::StickerLayer) }
    }
  }
}
