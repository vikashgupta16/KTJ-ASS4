

const ErrorMessage = ({ message }) => {
  return (
    <div className="error-message">
      <h3>Oops! Something went wrong</h3>
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
