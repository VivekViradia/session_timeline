import { useState, useMemo } from "react"
// import { Switch } from "@/components/ui/switch"
import { Users, Calendar } from "lucide-react"
import TimelineRow from "./timeline-row"
import { Switch } from "./ui/switch"

export default function SessionTimeline({ data }) {
  const [showParticipantTimeline, setShowParticipantTimeline] = useState(true)

  // Calculate session duration and time markers
  const sessionStart = new Date(data.start)
  const sessionEnd = new Date(data.end)
  const sessionDuration = Math.ceil((sessionEnd.getTime() - sessionStart.getTime()) / (1000 * 60)) // in minutes

  // Generate time markers for the timeline
  const timeMarkers = useMemo(() => {
    const markers = []
    const startTime = new Date(sessionStart)
    startTime.setSeconds(0, 0) // Round to nearest minute

    // Create markers every 2 minutes for better readability
    const interval = Math.max(2, Math.ceil(sessionDuration / 10))

    for (let i = 0; i <= sessionDuration + interval; i += interval) {
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

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-gray-400" />
          <h1 className="text-xl font-semibold text-white">Participants wise Session Timeline</h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">Show participant timeline</span>
          <Switch
            checked={showParticipantTimeline}
            onCheckedChange={setShowParticipantTimeline}
            className="data-[state=checked]:bg-blue-600"
          />
        </div>
      </div>

      {/* Session Info */}
      <div className="mb-6 p-4 bg-gray-800 rounded-lg">
        <div className="flex items-center gap-6 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Meeting ID: {data.meetingId}</span>
          </div>
          <div>Date: {formatDate(data.start)}</div>
          <div>Duration: {sessionDuration} mins</div>
          <div>Participants: {data.uniqueParticipantsCount}</div>
        </div>
      </div>

      {showParticipantTimeline && (
        <div className="space-y-6">
          {/* Time Scale */}
          <div className="relative h-8 mb-4">
            <div className="absolute inset-0 flex justify-between items-center text-xs text-gray-400 px-16">
              {timeMarkers.map((marker, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center"
                  style={{ position: "absolute", left: `${marker.position}%` }}
                >
                  <div className="w-px h-2 bg-gray-600 mb-1"></div>
                  <span>{marker.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Participant Timelines */}
          <div className="space-y-4">
            {data.participantArray.map((participant, index) => (
              <TimelineRow
                key={participant.participantId}
                participant={participant}
                sessionStart={sessionStart}
                sessionEnd={sessionEnd}
                sessionDuration={sessionDuration}
                participantIndex={index}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
