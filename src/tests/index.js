import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import converter from '../index';

const { describe, it } = global;

describe('propsConverter', () => {
  it('should replace props', () => {
    const component = sinon.stub().returns(null);
    const newProps = {
      a: 1,
      b: 2,
    };
    const wrapped = converter(() => newProps)(component);
    mount(React.createElement(wrapped, { foo: 'bar' }));
    expect(component.callCount).to.be.equal(1);
    expect(component.firstCall.args[0]).to.be.eql(newProps);
  });

  it('should add props', () => {
    const component = sinon.stub().returns(null);
    const newProps = {
      a: 1,
      b: 2,
    };
    const wrapped = converter(props => ({ ...props, ...newProps }))(component);
    mount(React.createElement(wrapped, { foo: 'bar' }));
    expect(component.callCount).to.be.equal(1);
    expect(component.firstCall.args[0]).to.be.eql({ ...newProps, foo: 'bar' });
  });

  it('should convert exists prop', () => {
    const component = sinon.stub().returns(null);
    const wrapped = converter(props => ({ ...props, value: parseInt(props.value, 10) }))(component);
    mount(React.createElement(wrapped, { foo: 'bar', value: '42' }));
    expect(component.callCount).to.be.equal(1);
    expect(component.firstCall.args[0]).to.be.eql({ foo: 'bar', value: 42 });
  });

  it('shouldn\'t call render if dropped prop changes', () => {
    const component = sinon.stub().returns(null);
    const wrapped = converter(props => ({ value: parseInt(props.value, 10) }))(component);
    const mounted = mount(React.createElement(wrapped, { foo: 'bar', value: '42' }));
    expect(component.callCount).to.be.equal(1);
    expect(component.firstCall.args[0]).to.be.eql({ value: 42 });

    mounted.setProps({ foo: 'foo' });
    expect(component.callCount).to.be.equal(1);
  });

  it('should call render if prop changes', () => {
    const component = sinon.stub().returns(null);
    const wrapped = converter(props => ({ value: parseInt(props.value, 10) }))(component);
    const mounted = mount(React.createElement(wrapped, { foo: 'bar', value: '42' }));
    expect(component.callCount).to.be.equal(1);
    expect(component.firstCall.args[0]).to.be.eql({ value: 42 });

    mounted.setProps({ value: '21' });
    expect(component.callCount).to.be.equal(2);
    expect(component.secondCall.args[0]).to.be.eql({ value: 21 });
  });

  it('should use custom equal', () => {
    const component = sinon.stub().returns(null);
    const wrapped = converter(
      props => ({ value: parseInt(props.value, 10) }),
      () => true, // everything is equals
    )(component);
    const mounted = mount(React.createElement(wrapped, { foo: 'bar', value: '42' }));
    expect(component.callCount).to.be.equal(1);
    expect(component.firstCall.args[0]).to.be.eql({ value: 42 });

    mounted.setProps({ value: '21' });
    expect(component.callCount).to.be.equal(1); // render hasn't been called because 42 equals 21
  });
});
