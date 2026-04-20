import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // Detect error
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // Log error
  componentDidCatch(error, errorInfo) {
    console.log("Error:", error);
    console.log("Error Info:", errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong ⚠️</h2>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;