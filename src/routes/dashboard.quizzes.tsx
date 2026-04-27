import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, PlayCircle, Clock, FileQuestion, XCircle } from "lucide-react";
import { useDashboardStore } from "@/stores/dashboard-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/quizzes")({
  component: DashboardQuizzes,
});

function DashboardQuizzes() {
  const quizzes = useDashboardStore((s) => s.quizzes);

  const handleStartQuiz = (title: string) => {
    toast.info(`Starting quiz: ${title}. Good luck!`);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Assessments & Quizzes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Test your knowledge and track your assessment scores.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <Badge
                  variant={
                    quiz.status === "available"
                      ? "default"
                      : quiz.status === "completed"
                      ? "secondary"
                      : "destructive"
                  }
                  className="mb-2"
                >
                  {quiz.status === "available" && <PlayCircle className="mr-1 h-3 w-3" />}
                  {quiz.status === "completed" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                  {quiz.status === "missed" && <XCircle className="mr-1 h-3 w-3" />}
                  <span className="capitalize">{quiz.status}</span>
                </Badge>
                {quiz.score !== undefined && (
                  <span className="text-sm font-bold text-primary">
                    Score: {quiz.score}%
                  </span>
                )}
              </div>
              <CardTitle>{quiz.title}</CardTitle>
              <CardDescription>{quiz.course}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-4">
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Duration: {quiz.duration} mins</span>
                </div>
                <div className="flex items-center">
                  <FileQuestion className="mr-2 h-4 w-4" />
                  <span>{quiz.questions} Questions</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              {quiz.status === "available" ? (
                <Button className="w-full" onClick={() => handleStartQuiz(quiz.title)}>
                  Start Assessment
                </Button>
              ) : (
                <Button variant="outline" className="w-full">
                  View Results
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
