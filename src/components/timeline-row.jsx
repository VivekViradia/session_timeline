import React, { useState, useMemo } from "react" // Added useMemo
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

  const formatDateWithTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }) + `, ${formatTime(dateString)}`;
  };

  const handleMouseEnter = (event, e) => {
    setHoveredEvent(event)
    setMousePosition({ x: e.clientX, y: e.clientY })
  }

  const handleMouseLeave = () => {
    setHoveredEvent(null)
  }

  const participantCode = `ABC${String(participantIndex + 1).padStart(3, "0")}`

  // Consolidate and sort all events for consistent rendering
  const allEvents = useMemo(() => {
    const events = [];

    participant.timelog.forEach((session) => {
      events.push({ type: "join", time: session.start, participant: participant.name });
      events.push({ type: "leave", time: session.end, participant: participant.name });
    });

    participant.events.webcam.forEach((event) => {
      events.push({ type: "webcam_on", time: event.start, participant: participant.name });
      events.push({ type: "webcam_off", time: event.end, participant: participant.name });
    });

    participant.events.mic.forEach((event) => {
      events.push({ type: "mic_on", time: event.start, participant: participant.name });
      events.push({ type: "mic_off", time: event.end, participant: participant.name });
    });

    participant.events.errors?.forEach((error) => {
      events.push({ type: "error", time: error.start, message: error.message, participant: participant.name });
    });

    return events.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  }, [participant]);

  // Calculate total interaction events for the badge
  const totalInteractionEvents = participant?.events?.webcam?.length + participant.events?.mic?.length + participant?.events?.errors?.length + participant?.timelog?.length;


  return (
    <div className="flex items-center gap-4 bg-gray-900 border-b border-gray-800 py-2 px-2 rounded">
      {/* Left: Participant Info */}
      <div className="w-56 flex-shrink-0">
        <div className="text-white font-medium">{participant.name} ({participantCode})</div>
        <div className="text-xs text-gray-400">
          {formatDateWithTime(participant.timelog[0]?.start || sessionStart.toISOString())} | Duration {sessionDuration} Mins
        </div>
      </div>

      {/* Center: Timeline */}
      <div className="relative flex-1 h-12 overflow-visible">
        {/* Full session duration background bar */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 rounded-lg bg-gray-700"></div>

        {/* Active session periods */}
        {participant.timelog.map((session, index) => (
          <div
            key={`active-${index}`}
            className="absolute top-1/2 -translate-y-1/2 h-2 bg-blue-500 rounded"
            style={{
              left: `${getPositionPercentage(session.start)}%`,
              width: `${getDurationPercentage(session.start, session.end)}%`,
            }}
          />
        ))}

        {/* Dotted lines for disconnected periods */}
        {participant.timelog.map((session, index) => {
          if (index < participant.timelog.length - 1) {
            const currentEnd = new Date(session.end);
            const nextStart = new Date(participant.timelog[index + 1].start);
            if (nextStart.getTime() > currentEnd.getTime()) {
              const leftPos = getPositionPercentage(currentEnd);
              const width = getDurationPercentage(currentEnd, nextStart);
              return (
                <div
                  key={`gap-${index}`}
                  className="absolute top-1/2 -translate-y-1/2 h-px bg-gray-500 border-t border-dotted border-gray-500"
                  style={{
                    left: `${leftPos}%`,
                    width: `${width}%`,
                  }}
                />
              );
            }
          }
          return null;
        })}

        {/* All Events (Join/Leave, Webcam, Mic, Errors) */}
        {allEvents.map((event, index) => {
          const iconSizeClass = "w-7 h-7"; // Consistent size for all icons
          let iconComponent;
          let bgColorClass;
          let zIndexClass = "z-10"; // Default z-index for most icons

          switch (event.type) {
            case "join":
              iconComponent = <LogIn className="w-4 h-4 text-white" />;
              bgColorClass = "bg-gray-700";
              break;
            case "leave":
              iconComponent = <LogOut className="w-4 h-4 text-white" />;
              bgColorClass = "bg-gray-700";
              break;
            case "webcam_on":
              iconComponent = <Video className="w-4 h-4 text-white" />;
              bgColorClass = "bg-blue-600";
              zIndexClass = "z-20";
              break;
            case "webcam_off":
              iconComponent = <Video className="w-4 h-4 text-white opacity-50" />;
              bgColorClass = "bg-gray-600";
              zIndexClass = "z-20";
              break;
            case "mic_on":
              iconComponent = <Mic className="w-4 h-4 text-white" />;
              bgColorClass = "bg-blue-600";
              zIndexClass = "z-20";
              break;
            case "mic_off":
              iconComponent = <Mic className="w-4 h-4 text-white opacity-50" />;
              bgColorClass = "bg-gray-600";
              zIndexClass = "z-20";
              break;
            case "error":
              iconComponent = <AlertTriangle className="w-4 h-4 text-white" />;
              bgColorClass = "bg-red-600";
              zIndexClass = "z-30";
              break;
            default:
              return null;
          }

          return (
            <div
              key={`${event.type}-${index}-${event.time}`}
              className={`absolute top-1/2 -translate-y-1/2 ${iconSizeClass} ${bgColorClass} rounded-full flex items-center justify-center ${zIndexClass}`}
              style={{ left: `calc(${getPositionPercentage(event.time)}% - 14px)` }}
              onMouseEnter={(e) => handleMouseEnter(event, e)}
              onMouseLeave={handleMouseLeave}
            >
              {iconComponent}
            </div>
          );
        })}

        {/* Event count badge */}
        {totalInteractionEvents > 0 && ( // Show badge if there are any interaction events
          <div
            className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-blue-800 rounded-full flex items-center justify-center text-xs text-white font-medium z-40"
            style={{
              // Position it closer to the right end, or based on the last event's position if applicable
              right: '20px', // Adjusted to be on the right side as per UI
            }}
          >
            {totalInteractionEvents}
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