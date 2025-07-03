import React, { useState } from "react"
import { ChevronRight, Video, Mic, AlertTriangle, LogIn, LogOut } from "lucide-react"
import EventTooltip from "./event-tooltip"
import { Button } from "./ui/button"

export default function TimelineRow({
  participant,
  sessionStart,
  sessionEnd,
  sessionDuration,
  participantIndex,
}) {
  const [hoveredEvent, setHoveredEvent] = useState(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const getPositionPercentage = (timestamp) => {
    const eventTime = new Date(timestamp)
    const elapsed = eventTime.getTime() - sessionStart.getTime()
    const total = sessionEnd.getTime() - sessionStart.getTime()
    return Math.max(0, Math.min(100, (elapsed / total) * 100))
  }

  const getDurationPercentage = (startTime, endTime) => {
    const start = new Date(startTime)
    const end = new Date(endTime)
    const duration = end.getTime() - start.getTime()
    const total = sessionEnd.getTime() - sessionStart.getTime()
    return (duration / total) * 100
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  const handleMouseEnter = (event, e) => {
    setHoveredEvent(event)
    setMousePosition({ x: e.clientX, y: e.clientY })
  }

  const handleMouseLeave = () => {
    setHoveredEvent(null)
  }

  const participantCode = `ABC${String(participantIndex + 1).padStart(3, "0")}`

  return (
    <div className="flex items-center gap-4 bg-gray-900 border-b border-gray-800 py-2 px-2 rounded">
      {/* Left: Participant Info */}
      <div className="w-56 flex-shrink-0">
        <div className="text-white font-medium">{participant.name} ({participantCode})</div>
        <div className="text-xs text-gray-400">
          {formatDate(participant.timelog[0]?.start || sessionStart.toISOString())},{" "}
          {formatTime(participant.timelog[0]?.start || sessionStart.toISOString())} | Duration {sessionDuration} Mins
        </div>
      </div>

      {/* Center: Timeline */}
      <div className="relative flex-1 h-12 overflow-visible">
        {/* Session duration bar */}
        <div className="absolute inset-y-0 left-0 right-0 rounded-lg"></div>

        {/* Active session periods */}
        {participant.timelog.map((session, index) => (
          <div
            key={index}
            className="absolute top-1/2 -translate-y-1/2 h-2 bg-blue-500 rounded"
            style={{
              left: `${getPositionPercentage(session.start)}%`,
              width: `${getDurationPercentage(session.start, session.end)}%`,
            }}
          />
        ))}

        {/* Join/Leave Events */}
        {participant.timelog.map((session, index) => (
          <React.Fragment key={index}>
            <div
              className="absolute top-1/2 -translate-y-1/2 w-7 h-7 bg-gray-700 rounded-full flex items-center justify-center z-10"
              style={{ left: `calc(${getPositionPercentage(session.start)}% - 14px)` }}
              onMouseEnter={(e) =>
                handleMouseEnter(
                  { type: "join", time: session.start, participant: participant.name },
                  e
                )
              }
              onMouseLeave={handleMouseLeave}
            >
              <LogIn className="w-4 h-4 text-white" />
            </div>
            <div
              className="absolute top-1/2 -translate-y-1/2 w-7 h-7 bg-gray-700 rounded-full flex items-center justify-center z-10"
              style={{ left: `calc(${getPositionPercentage(session.end)}% - 14px)` }}
              onMouseEnter={(e) =>
                handleMouseEnter(
                  { type: "leave", time: session.end, participant: participant.name },
                  e
                )
              }
              onMouseLeave={handleMouseLeave}
            >
              <LogOut className="w-4 h-4 text-white" />
            </div>
          </React.Fragment>
        ))}

        {/* Webcam Events */}
        {participant.events.webcam.map((event, index) => (
          <React.Fragment key={`webcam-${index}`}>
            <div
              className="absolute top-1/2 -translate-y-1/2 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center z-20"
              style={{ left: `calc(${getPositionPercentage(event.start)}% - 14px)` }}
              onMouseEnter={(e) =>
                handleMouseEnter(
                  { type: "webcam_on", time: event.start, participant: participant.name },
                  e
                )
              }
              onMouseLeave={handleMouseLeave}
            >
              <Video className="w-4 h-4 text-white" />
            </div>
            <div
              className="absolute top-1/2 -translate-y-1/2 w-7 h-7 bg-gray-600 rounded-full flex items-center justify-center z-20"
              style={{ left: `calc(${getPositionPercentage(event.end)}% - 14px)` }}
              onMouseEnter={(e) =>
                handleMouseEnter(
                  { type: "webcam_off", time: event.end, participant: participant.name },
                  e
                )
              }
              onMouseLeave={handleMouseLeave}
            >
              <Video className="w-4 h-4 text-white opacity-50" />
            </div>
          </React.Fragment>
        ))}

        {/* Mic Events */}
        {participant.events.mic.map((event, index) => (
          <React.Fragment key={`mic-${index}`}>
            <div
              className="absolute top-1/2 -translate-y-1/2 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center z-20"
              style={{ left: `calc(${getPositionPercentage(event.start)}% - 14px)` }}
              onMouseEnter={(e) =>
                handleMouseEnter(
                  { type: "mic_on", time: event.start, participant: participant.name },
                  e
                )
              }
              onMouseLeave={handleMouseLeave}
            >
              <Mic className="w-4 h-4 text-white" />
            </div>
            <div
              className="absolute top-1/2 -translate-y-1/2 w-7 h-7 bg-gray-600 rounded-full flex items-center justify-center z-20"
              style={{ left: `calc(${getPositionPercentage(event.end)}% - 14px)` }}
              onMouseEnter={(e) =>
                handleMouseEnter(
                  { type: "mic_off", time: event.end, participant: participant.name },
                  e
                )
              }
              onMouseLeave={handleMouseLeave}
            >
              <Mic className="w-4 h-4 text-white opacity-50" />
            </div>
          </React.Fragment>
        ))}

        {/* Error Events */}
        {participant.events.errors?.map((error, index) => (
          <div
            key={`error-${index}`}
            className="absolute top-1/2 -translate-y-1/2 w-7 h-7 bg-red-600 rounded-full flex items-center justify-center z-30"
            style={{ left: `calc(${getPositionPercentage(error.start)}% - 14px)` }}
            onMouseEnter={(e) =>
              handleMouseEnter(
                { type: "error", time: error.start, message: error.message, participant: participant.name },
                e
              )
            }
            onMouseLeave={handleMouseLeave}
          >
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
        ))}

        {/* Event count badge */}
        {(participant.events.mic.length > 1 || participant.events.webcam.length > 1) && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-blue-800 rounded-full flex items-center justify-center text-xs text-white font-medium z-40"
            style={{
              left: `calc(${getPositionPercentage(
                participant.events.mic[0]?.start || participant.events.webcam[0]?.start,
              )}% + 20px)`,
            }}
          >
            {(participant.events.mic.length + participant.events.webcam.length) * 2}
          </div>
        )}
      </div>

      {/* Right: View Details */}
      <div className="w-32 flex-shrink-0 flex justify-end">
        <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
          View details
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Tooltip */}
      {hoveredEvent && <EventTooltip event={hoveredEvent} position={mousePosition} />}
    </div>
  )
}