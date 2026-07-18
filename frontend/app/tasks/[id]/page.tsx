"use client";

import { useEffect, useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getTaskTimeline } from "@/lib/activity";
import { performTaskAction } from "@/lib/task-actions";
import { getCurrentUser } from "@/lib/auth";
import {
  Clock,
  User,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Activity,
  ArrowUpRight,
  Loader2,
} from "lucide-react";

export default function TaskDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const user = getCurrentUser();
  const [isPending, startTransition] = useTransition();

  const [task, setTask] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper functions to get semantic styling for status/priority
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "DONE":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "IN_PROGRESS":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "IN_REVIEW":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "CANCELLED":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case "HIGH":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "MEDIUM":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  async function loadTaskData() {
    try {
      const response = await api.get(`/tasks/${params.id}`);
      setTask(response.data);
      const timelineData = await getTaskTimeline(Number(params.id));
      setTimeline(timelineData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAction(action: string) {
    console.log("Clicked:", action);
    await performTaskAction(Number(params.id), action);

    // Smooth data refresh without hard reloading the browser tab
    startTransition(async () => {
      await loadTaskData();
    });
  }

  useEffect(() => {
    loadTaskData();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
        <h3 className="text-lg font-semibold">Task not found</h3>
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Back to Dashboard Navigation */}
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-foreground gap-1.5 -ml-2"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Button>

      {/* Main Layout Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* LEFT & CENTER COLUMN: Context & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 md:p-8 space-y-6 shadow-sm">
            <div className="space-y-3">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                {task.title}
              </h1>
              <div className="flex flex-wrap gap-2 pt-1 lg:hidden">
                <Badge
                  variant="outline"
                  className={getStatusStyle(task.status)}
                >
                  {task.status}
                </Badge>
                <Badge
                  variant="outline"
                  className={getPriorityStyle(task.priority)}
                >
                  {task.priority} Priority
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Description
              </h3>
              <p className="text-base text-foreground leading-relaxed whitespace-pre-wrap">
                {task.description || "No description provided for this task."}
              </p>
            </div>
          </Card>

          {/* Activity Timeline Card */}
          <Card className="p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Activity History
            </h2>

            <div className="relative border-l-2 border-muted ml-3 pl-6 space-y-6">
              {timeline.length === 0 && (
                <p className="text-sm text-muted-foreground -ml-6 pl-6">
                  No activity recorded yet.
                </p>
              )}

              {timeline.map((event) => (
                <div key={event.id} className="relative group">
                  {/* Timeline Node Ring */}
                  <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-background bg-muted-foreground group-hover:bg-primary transition-colors duration-200" />

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                      {event.action}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {event.user?.name ?? "System"}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(event.createdAt).toLocaleString(undefined, {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: Sidebar Metadata & Dynamic Controls */}
        <div className="space-y-6 lg:sticky lg:top-8">
          <Card className="p-6 space-y-6 shadow-sm">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Metadata & Controls
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge
                  variant="outline"
                  className={`font-semibold tracking-wide ${getStatusStyle(task.status)}`}
                >
                  {task.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-sm text-muted-foreground">Priority</span>
                <Badge
                  variant="outline"
                  className={`font-semibold ${getPriorityStyle(task.priority)}`}
                >
                  {task.priority}
                </Badge>
              </div>
            </div>

            {/* Contextual Action Button Group */}
            <div className="flex flex-col gap-2 pt-2">
              {isPending && (
                <Button disabled variant="outline" className="w-full gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Updating Task...
                </Button>
              )}

              {!isPending && (
                <>
                  {/* MEMBER CONTROLS */}
                  {user?.role === "MEMBER" && task.status === "BACKLOG" && (
                    <Button
                      className="w-full shadow-sm"
                      onClick={() => handleAction("START")}
                    >
                      Start Work <ArrowUpRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  )}

                  {user?.role === "MEMBER" && task.status === "IN_PROGRESS" && (
                    <Button
                      className="w-full shadow-sm"
                      onClick={() => handleAction("SUBMIT_REVIEW")}
                    >
                      Submit for Review
                    </Button>
                  )}

                  {/* MANAGER CONTROLS */}
                  {user?.role === "MANAGER" && task.status === "IN_REVIEW" && (
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
                        onClick={() => handleAction("ACCEPT")}
                      >
                        <CheckCircle className="mr-1.5 h-4 w-4" /> Accept
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleAction("SEND_BACK")}
                      >
                        Send Back
                      </Button>
                    </div>
                  )}

                  {user?.role === "MANAGER" && task.status === "CANCELLED" && (
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() => handleAction("REOPEN")}
                    >
                      Reopen Task
                    </Button>
                  )}

                  {user?.role === "MANAGER" &&
                    (task.status === "BACKLOG" ||
                      task.status === "IN_PROGRESS") && (
                      <Button
                        variant="destructive"
                        className="w-full bg-destructive/10 hover:bg-destructive hover:text-destructive-foreground text-destructive border border-destructive/20"
                        onClick={() => handleAction("CANCEL")}
                      >
                        Cancel Task
                      </Button>
                    )}
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
