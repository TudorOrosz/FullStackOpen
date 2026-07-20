import { useMessages } from "../store";

const Notification = ({ message: propMessage, type: propType }) => {
  const { text, type } = useMessages();

  const message = propMessage ?? text;
  const notificationType = propType ?? type;

  if (!message) {
    return null;
  }

  return (
    <div className={notificationType === "error" ? "error_message" : "success_message"}>
      {message}
    </div>
  );
};

export default Notification;
