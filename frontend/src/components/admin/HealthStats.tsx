import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock, Database, MemoryStick } from "lucide-react";

interface HealthData {
  status: string;
  version: string;
  uptime: number;
  database: {
    connected: boolean;
    latencyMs: number;
    articleCount: number;
    userCount: number;
  };
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    rssMB: number;
  };
}

interface HealthStatsProps {
  healthData: HealthData;
}

function formatUptime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
}

export function HealthStats({ healthData }: HealthStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card data-testid="card-health-status">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Status</span>
            </div>
            <Badge variant={healthData.status === "healthy" ? "default" : "destructive"}>
              {healthData.status}
            </Badge>
          </div>
          <p className="text-lg font-semibold mt-2">v{healthData.version}</p>
        </CardContent>
      </Card>
      <Card data-testid="card-health-uptime">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Uptime</span>
          </div>
          <p className="text-lg font-semibold">{formatUptime(healthData.uptime)}</p>
        </CardContent>
      </Card>
      <Card data-testid="card-health-database">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Database</span>
            </div>
            <Badge variant={healthData.database.connected ? "default" : "destructive"}>
              {healthData.database.connected ? "Connected" : "Disconnected"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Latency: {healthData.database.latencyMs}ms
          </p>
        </CardContent>
      </Card>
      <Card data-testid="card-health-memory">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <MemoryStick className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Memory</span>
          </div>
          <p className="text-lg font-semibold">{healthData.memory.heapUsedMB} / {healthData.memory.heapTotalMB} MB</p>
        </CardContent>
      </Card>
    </div>
  );
}