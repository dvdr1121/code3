import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    console.log("[v0] Starting review generation")

    // Verify API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error("[v0] OPENAI_API_KEY environment variable is not set")
      return Response.json({ error: "サーバー設定エラー: API キーが設定されていません" }, { status: 500 })
    }

    console.log("[v0] API key is configured")

    const body = await req.json()
    console.log("[v0] Request body:", { ...body, comment: body.comment?.substring(0, 20) + "..." })

    const { service, skill, atmosphere, comment } = body

    // Validate input
    if (!service || !skill || !atmosphere || !comment) {
      console.log("[v0] Validation failed - missing required fields")
      return Response.json({ error: "すべての項目を入力してください" }, { status: 400 })
    }

    console.log("[v0] Calling AI SDK generateText...")

    const prompt = `あなたはホットペッパービューティーのレビュー作成アシスタントです。
以下の情報をもとに、自然で好意的な日本語の口コミを生成してください。

評価：
- サービス: ${service}つ星
- 技術・仕上がり: ${skill}つ星  
- 雰囲気: ${atmosphere}つ星

お客様のコメント：
「${comment}」

要件：
- 100文字程度の自然な日本語で書いてください
- フレンドリーで前向きな口調で
- 具体的なコメントを含めつつ、総合的な満足感を表現してください
- 「また利用したい」といった前向きな締めくくりを含めてください

レビュー文のみを出力してください。説明文や前置きは不要です。`

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
    })

    console.log("[v0] Successfully generated review, length:", text.length)

    return Response.json({ review: text.trim() })
  } catch (error) {
    console.error("[v0] Error in generate-review API:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("[v0] Error details:", errorMessage)
    return Response.json(
      {
        error: "口コミの生成に失敗しました。時間をおいてもう一度お試しください。",
        details: errorMessage, // Include error details for debugging
      },
      { status: 500 },
    )
  }
}
