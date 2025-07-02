import { useEffect, useState } from "react"

export default function EventTooltip({ event, position }) {
  const [tooltipPosition, setTooltipPosition] = useState(position)

  useEffect(() => {
    setTooltipPosition(position)
  }, [position])

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const getEventTitle = () => {
    switch (event.type) {
      case "join":
        return "Participant Joined"
      case "leave":
        return "Participant Left"
      case "webcam_on":
        return "Camera Turned On"
      case "webcam_off":
        return "Camera Turned Off"
      case "mic_on":
        return "Microphone Unmuted"
      case "mic_off":
        return "Microphone Muted"
      case "error":
        return "Error Occurred"
      default:
        return "Event"
    }
  }

  const getEventColor = () => {
    switch (event.type) {
      case "error":
        return "border-red-500 bg-red-900"
      case "join":
      case "leave":
        return "border-gray-500 bg-gray-800"
      default:
        return "border-blue-500 bg-blue-900"
    }
  }

  return (
    <div
      className={`fixed z-50 p-3 rounded-lg border text-white text-sm shadow-lg max-w-xs ${getEventColor()}`}
      style={{
        left: tooltipPosition.x + 10,
        top: tooltipPosition.y - 10,
        transform: "translateY(-100%)",
      }}
    >
      <div className="font-medium mb-1">{getEventTitle()}</div>
      <div className="text-xs text-gray-300 space-y-1">
        <div>Participant: {event.participant}</div>
        <div>Time: {formatTime(event.time)}</div>
        {event.endTime && <div>End Time: {formatTime(event.endTime)}</div>}
        {event.message && <div className="text-red-300">Error: {event.message}</div>}
      </div>
    </div>
  )
}
