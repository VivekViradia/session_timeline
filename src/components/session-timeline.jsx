import { useState, useMemo } from "react"
import { Users, Calendar } from "lucide-react"
import TimelineRow from "./timeline-row"
import { Switch } from "./ui/switch"

export default function SessionTimeline({ data }) {
  const [showParticipantTimeline, setShowParticipantTimeline] = useState(true)

  const sessionStart = new Date(data.start)
  const sessionEnd = new Date(data.end)
  const sessionDuration = Math.ceil((sessionEnd.getTime() - sessionStart.getTime()) / (1000 * 60))

  const timeMarkers = useMemo(() => {
    const markers = []
    const startTime = new Date(sessionStart)
    startTime.setSeconds(0, 0)
    const interval = Math.max(1, Math.ceil(sessionDuration / 10))
    for (let i = 0; i <= sessionDuration; i += interval) {
      const time = new Date(startTime.getTime() + i * 60 * 1000)
      markers.push({
        time: time.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        }),
        position: (i / sessionDuration) * 100,
      })
    }
    return markers
  }, [sessionStart, sessionDuration])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <div className="w-full max-w-7xl mx-auto border-2 border-blue-400 rounded-lg p-2 bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 px-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          <span className="text-base font-semibold text-white">Participants wise Session Timeline</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Show participant timeline</span>
          <Switch
            checked={showParticipantTimeline}
            onCheckedChange={setShowParticipantTimeline}
            className="data-[state=checked]:bg-blue-600"
          />
        </div>
      </div>

      {/* Time Scale */}
      <div className="relative h-8 mb-2 px-2">
        <div className="absolute inset-0 flex items-end">
          {timeMarkers.map((marker, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center"
              style={{ position: "absolute", left: `${marker.position}%` }}
            >
              <div className="w-px h-2 bg-gray-600 mb-1"></div>
              <span className="text-xs text-gray-400">{marker.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Participant Timelines */}
      {showParticipantTimeline && (
        <div className="space-y-2">
          {data.participantArray.map((participant, idx) => (
            <TimelineRow
              key={participant.participantId}
              participant={participant}
              sessionStart={sessionStart}
              sessionEnd={sessionEnd}
              sessionDuration={sessionDuration}
              participantIndex={idx}
            />
          ))}
        </div>
      )}
    </div>
  )
}
