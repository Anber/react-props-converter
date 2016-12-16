import React from 'react';
import hoistStatics from 'hoist-non-react-statics';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function defaultEquals(a, b) {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false;
  }

  return !aKeys.some(key => a[key] !== b[key]);
}

export default function propsConverter(converterFn, equalsFn = defaultEquals) {
  return (WrappedComponent) => {
    class PropsConverter extends React.Component {
      state = {
        props: {},
      };

      componentWillMount() {
        this.setState({
          props: converterFn(this.props),
        });
      }

      componentWillReceiveProps(nextProps) {
        const { props: thisProps } = this.state;
        const nextParams = converterFn(nextProps);
        if (nextParams === thisProps || equalsFn(nextParams, thisProps)) {
          return;
        }

        this.setState({
          props: nextParams,
        });
      }

      shouldComponentUpdate(nextProps, nextState) {
        return this.state !== nextState;
      }

      render() {
        return (
          <WrappedComponent {...this.state.props} />
        );
      }
    }

    PropsConverter.displayName = `PropsConverter(${getDisplayName(WrappedComponent)})`;
    PropsConverter.WrappedComponent = WrappedComponent;

    return hoistStatics(PropsConverter, WrappedComponent);
  };
}
