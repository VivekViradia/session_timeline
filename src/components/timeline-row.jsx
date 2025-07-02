import React from "react"
import { useState } from "react"
// import { Button } from "@/components/ui/button"
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

  // Calculate position percentage based on time
  const getPositionPercentage = (timestamp) => {
    const eventTime = new Date(timestamp)
    const elapsed = eventTime.getTime() - sessionStart.getTime()
    const total = sessionEnd.getTime() - sessionStart.getTime()
    return Math.max(0, Math.min(100, (elapsed / total) * 100))
  }

  // Calculate duration percentage
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

  // Generate participant ID based on index
  const participantCode = `ABC${String(participantIndex + 1).padStart(3, "0")}`

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      {/* Participant Info */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-medium">
            {participant.name} ({participantCode})
          </h3>
          <div className="text-sm text-gray-400">
            {formatDate(participant.timelog[0]?.start || sessionStart.toISOString())},{" "}
            {formatTime(participant.timelog[0]?.start || sessionStart.toISOString())} | Duration {sessionDuration} Mins
          </div>
        </div>

        <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
          View details
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Timeline */}
      <div className="relative h-12 bg-gray-700 rounded-lg overflow-hidden">
        {/* Session duration bar */}
        <div className="absolute inset-y-0 left-0 right-0 bg-gray-600 rounded-lg"></div>

        {/* Active session periods */}
        {participant.timelog.map((session, index) => (
          <div
            key={index}
            className="absolute top-0 bottom-0 bg-blue-500 rounded"
            style={{
              left: `${getPositionPercentage(session.start)}%`,
              width: `${getDurationPercentage(session.start, session.end)}%`,
            }}
          />
        ))}

        {/* Join events */}
        {participant.timelog.map((session, index) => (
          <div
            key={`join-${index}`}
            className="absolute top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-500 transition-colors z-10"
            style={{ left: `calc(${getPositionPercentage(session.start)}% - 16px)` }}
            onMouseEnter={(e) =>
              handleMouseEnter(
                {
                  type: "join",
                  time: session.start,
                  participant: participant.name,
                },
                e,
              )
            }
            onMouseLeave={handleMouseLeave}
          >
            <LogIn className="w-4 h-4 text-white" />
          </div>
        ))}

        {/* Leave events */}
        {participant.timelog.map((session, index) => (
          <div
            key={`leave-${index}`}
            className="absolute top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-500 transition-colors z-10"
            style={{ left: `calc(${getPositionPercentage(session.end)}% - 16px)` }}
            onMouseEnter={(e) =>
              handleMouseEnter(
                {
                  type: "leave",
                  time: session.end,
                  participant: participant.name,
                },
                e,
              )
            }
            onMouseLeave={handleMouseLeave}
          >
            <LogOut className="w-4 h-4 text-white" />
          </div>
        ))}

        {/* Webcam events */}
        {participant.events.webcam.map((event, index) => (
          <div
            key={`webcam-${index}`}
            className="absolute top-1/2 transform -translate-y-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-500 transition-colors z-20"
            style={{ left: `calc(${getPositionPercentage(event.start)}% - 16px)` }}
            onMouseEnter={(e) =>
              handleMouseEnter(
                {
                  type: "webcam_on",
                  time: event.start,
                  endTime: event.end,
                  participant: participant.name,
                },
                e,
              )
            }
            onMouseLeave={handleMouseLeave}
          >
            <Video className="w-4 h-4 text-white" />
          </div>
        ))}

        {/* Mic events */}
        {participant.events.mic.map((event, index) => (
          <div
            key={`mic-${index}`}
            className="absolute top-1/2 transform -translate-y-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-500 transition-colors z-20"
            style={{ left: `calc(${getPositionPercentage(event.start)}% - 16px)` }}
            onMouseEnter={(e) =>
              handleMouseEnter(
                {
                  type: "mic_on",
                  time: event.start,
                  endTime: event.end,
                  participant: participant.name,
                },
                e,
              )
            }
            onMouseLeave={handleMouseLeave}
          >
            <Mic className="w-4 h-4 text-white" />
          </div>
        ))}

        {/* Error events */}
        {participant.events.errors?.map((error, index) => (
          <div
            key={`error-${index}`}
            className="absolute top-1/2 transform -translate-y-1/2 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-500 transition-colors z-30"
            style={{ left: `calc(${getPositionPercentage(error.start)}% - 16px)` }}
            onMouseEnter={(e) =>
              handleMouseEnter(
                {
                  type: "error",
                  time: error.start,
                  message: error.message,
                  participant: participant.name,
                },
                e,
              )
            }
            onMouseLeave={handleMouseLeave}
          >
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
        ))}

        {/* Event count badges */}
        {participant.events.mic.length > 1 && (
          <div
            className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 bg-blue-800 rounded-full flex items-center justify-center text-xs text-white font-medium z-40"
            style={{ left: `calc(${getPositionPercentage(participant.events.mic[0].start)}% - 8px)` }}
          >
            {participant.events.mic.length}
          </div>
        )}
      </div>

      {/* Tooltip */}
      {hoveredEvent && <EventTooltip event={hoveredEvent} position={mousePosition} />}
    </div>
  )
}
