"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Sparkles, Copy, RotateCcw, Loader2 } from "lucide-react"
import { StarRating } from "@/components/star-rating"
import { useToast } from "@/hooks/use-toast"

type ReviewData = {
  service: number
  skill: number
  atmosphere: number
  comment: string
  hotpepperUrl: string
}

export default function ReviewGenerator() {
  const [reviewData, setReviewData] = useState<ReviewData>({
    service: 0,
    skill: 0,
    atmosphere: 0,
    comment: "",
    hotpepperUrl: "",
  })
  const [generatedReview, setGeneratedReview] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const { toast } = useToast()

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      })

      if (!response.ok) throw new Error("Failed to generate review")

      const data = await response.json()
      setGeneratedReview(data.review)
      setShowResult(true)
    } catch (error) {
      console.error("[v0] Error generating review:", error)
      toast({
        title: "エラーが発生しました",
        description: "時間をおいてもう一度お試しください。",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedReview)
      toast({
        title: "コピーしました！",
        description: "レビューがクリップボードにコピーされました。",
      })
    } catch (error) {
      console.error("[v0] Error copying to clipboard:", error)
      toast({
        title: "コピーに失敗しました",
        description: "もう一度お試しください。",
        variant: "destructive",
      })
    }
  }

  const handleReset = () => {
    setShowResult(false)
    setReviewData({
      service: 0,
      skill: 0,
      atmosphere: 0,
      comment: "",
      hotpepperUrl: "",
    })
    setGeneratedReview("")
  }

  const canGenerate =
    reviewData.service > 0 && reviewData.skill > 0 && reviewData.atmosphere > 0 && reviewData.comment.trim().length > 0

  return (
    <div className="w-full max-w-[480px]">
      <div className="text-center mb-6 sm:mb-8 px-2">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 mb-3 sm:mb-4">
          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-balance">AIでつくるサロン口コミ</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          かんたん入力で、きれいな日本語の口コミ文を自動生成します。
        </p>
      </div>

      <Card className="shadow-lg border sm:border-2">
        {!showResult ? (
          <>
            <CardHeader className="space-y-1 pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
              <CardTitle className="text-xl sm:text-2xl">評価とコメントを入力</CardTitle>
              <CardDescription className="text-sm">
                3つのカテゴリーで星評価を選び、コメントを入力してください
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="space-y-2 sm:space-y-3">
                <label className="text-sm font-medium">ホットペッパーの口コミURL（任意）</label>
                <Input
                  type="url"
                  placeholder="https://beauty.hotpepper.jp/..."
                  value={reviewData.hotpepperUrl}
                  onChange={(e) => setReviewData({ ...reviewData, hotpepperUrl: e.target.value })}
                  className="rounded-2xl text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2 sm:space-y-3">
                <label className="text-sm font-medium">接客</label>
                <StarRating
                  value={reviewData.service}
                  onChange={(value) => setReviewData({ ...reviewData, service: value })}
                />
              </div>

              <div className="space-y-2 sm:space-y-3">
                <label className="text-sm font-medium">技術</label>
                <StarRating
                  value={reviewData.skill}
                  onChange={(value) => setReviewData({ ...reviewData, skill: value })}
                />
              </div>

              <div className="space-y-2 sm:space-y-3">
                <label className="text-sm font-medium">お店の雰囲気</label>
                <StarRating
                  value={reviewData.atmosphere}
                  onChange={(value) => setReviewData({ ...reviewData, atmosphere: value })}
                />
              </div>

              <div className="space-y-2 sm:space-y-3">
                <label className="text-sm font-medium">特に良かったところ</label>
                <Textarea
                  placeholder="例）仕上がりがとても綺麗で、説明も分かりやすかったです。"
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  className="min-h-28 sm:min-h-32 resize-none rounded-2xl text-sm sm:text-base"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!canGenerate || isGenerating}
                className="w-full rounded-full h-11 sm:h-12 gap-2 text-sm sm:text-base"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    口コミを作成する
                  </>
                )}
              </Button>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="space-y-1 pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
              <CardTitle className="text-xl sm:text-2xl">AIが作成した口コミ文</CardTitle>
              <CardDescription className="text-sm">
                レビューをコピーしてホットペッパービューティーに投稿しましょう
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="p-4 sm:p-6 rounded-2xl bg-primary/5 border-2 border-primary/20">
                <p className="text-sm sm:text-base leading-relaxed">{generatedReview}</p>
                <div className="mt-2 sm:mt-3 text-xs text-muted-foreground text-right">
                  {generatedReview.length}文字
                </div>
              </div>

              <div className="flex gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="flex-1 rounded-full h-11 sm:h-12 gap-2 bg-transparent text-sm sm:text-base"
                  size="lg"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden xs:inline">もう一度作る</span>
                  <span className="xs:hidden">再作成</span>
                </Button>
                <Button
                  onClick={handleCopy}
                  className="flex-1 rounded-full h-11 sm:h-12 gap-2 text-sm sm:text-base"
                  size="lg"
                >
                  <Copy className="w-4 h-4" />
                  コピー
                </Button>
              </div>
            </CardContent>
          </>
        )}
      </Card>

      <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-muted-foreground px-2">
        <p>ホットペッパービューティー用の口コミを簡単作成</p>
      </div>
    </div>
  )
}
