import React from 'react';
import ErrorComp from './ErrorComponent';

class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { 
          hasError: false,
          error: '',
          errorStack: '', 
        };
    }
  
    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true, error: error };
    }
  
    componentDidCatch(error, errorInfo) {
      this.setState({
        error: error,
        errorStack: errorInfo.componentStack
      });
      // TODO: log error to server
    }
  
    render() {
      if (this.state.hasError) {
        // render fallback UI
        return(
            <div>
                <br /><br />
                <ErrorComp error={this.state.error}/>
            </div>
        );
      }
  
      return this.props.children; 
    }
  }

  export default ErrorBoundary