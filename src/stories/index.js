import React from 'react';
import { storiesOf } from '@kadira/storybook';
import converter from '../index';

const Component = props => (<div>{props.value}</div>);
Component.propTypes = {
  value: React.PropTypes.number.isRequired,
};

const Wrapped = converter(props => ({ value: parseInt(props.value, 16) }))(Component);

storiesOf('Button', module)
  .add('default view', () => (
    <Wrapped value="FF" />
  ));
