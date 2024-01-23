import React from 'react';

const Course = ({ courses }) => {
  return (
    <div>
      {courses.map((course) => {
        const totalExercises = course.parts.reduce((sum, part) => {
          const exercises = isNaN(part.exercises) ? 0 : part.exercises;
          return sum + exercises;
        }, 0);

        return (
          <div key={course.id}>
            <h2>{course.name}</h2>
            {course.parts.map((part) => (
              <p key={part.id}>
                {part.name} {part.exercises} exercises
              </p>
            ))}
            <p><strong>Total of exercises {totalExercises}</strong></p>
          </div>
        );
      })}
    </div>
  );
};

export default Course;
