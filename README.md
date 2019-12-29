# redux-autowire

This library was created to handle the common setup for most of my personal projects.

The goal is to have a single class that can create an action, dispatch that action, and handle that action while also removing the overhead of having to manage individual reducers and setting up reducers / types for actions. It also contains a helper decorator to properly connect the redux state to a react component.

Usage: see [examples](./example/)
