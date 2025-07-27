import React from 'react';
import styles from './StashPrompt.module.css';
import { useStash } from './StashContext';

const StashPrompt: React.FC = () => {
  const { closePrompt } = useStash();
  return (
    <div className={styles.stashPrompt}>
      <div className={styles.stashPromptContent}>
        <span>
          <a href="/signin" className={styles.link}>Sign in</a> or <a href="/signup" className={styles.link}>create an account</a> to access your wishlist from anywhere.
        </span>
        <button className={styles.closeBtn} onClick={closePrompt} aria-label="Close">×</button>
      </div>
    </div>
  );
};

export default StashPrompt; 