import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    // Verify API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error("[v0] OPENAI_API_KEY environment variable is not set")
      return Response.json({ error: "サーバー設定エラー: API キーが設定されていません" }, { status: 500 })
    }

    const body = await req.json()
    const { service, skill, atmosphere, comment } = body

    // Validate input
    if (!service || !skill || !atmosphere || !comment) {
      return Response.json({ error: "すべての項目を入力してください" }, { status: 400 })
    }

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

    return Response.json({ review: text.trim() })
  } catch (error) {
    console.error("[v0] Error in generate-review API:", error)
    return Response.json(
      {
        error: "口コミの生成に失敗しました。時間をおいてもう一度お試しください。",
      },
      { status: 500 },
    )
  }
}
