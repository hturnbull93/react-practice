import React from 'react';
import styles from './style.module.css'; 

export class Car extends React.Component {
  render() {
    return (
      <h2 className={styles.bigblue}>I am a car</h2>
    )
  }
}

export default Car
