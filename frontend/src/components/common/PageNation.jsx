import React from "react";

const PageNation = () => {
  return (
    <div>
      <div className={styles.pagination}>
        {step > 0 && (
          <button className={styles.pagination__button} onClick={moveToPrev}>
            <img src="./src/assets/icons/icon-arrowLeft.svg" alt="Left" />
          </button>
        )}
        {/* 변경될 UI 부분 */}
        {/* <span>1</span> */}
        {res[step]?.map((item: number, index: number) => {
          if (item < 11) {
            return (
              <button
                className={
                  index === page - 1
                    ? `${styles.pagination__button} ${styles.active}`
                    : `${styles.pagination__button} ${styles.inactive}`
                }
                key={item}
                onClick={() => {
                  moveToPage(item);
                }}
              >
                {item}
              </button>
            );
          } else {
            return (
              <button
                className={
                  index === page - 1 - step * 10
                    ? `${styles.pagination__button} ${styles.active}`
                    : `${styles.pagination__button} ${styles.inactive}`
                }
                key={item}
                onClick={() => {
                  moveToPage(item);
                }}
              >
                {item}
              </button>
            );
          }
        })}
        {step < divide - 1 && (
          <button className={styles.pagination__button} onClick={moveToNext}>
            <img src="./src/assets/icons/icon-arrowRight.svg" alt="Right" />
          </button>
        )}
      </div>
    </div>
  );
};
export default PageNation;
