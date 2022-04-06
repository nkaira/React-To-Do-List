import React from "react";
import PropTypes from "prop-types";
import cn from "classnames"
import { Link } from "react-router-dom";

import styles from "./taskList.module.scss";

class TaskList extends React.Component {
    render() {
        const { paginatedTasks, onComplete, onModalShow } = this.props;

        return (
            <ul className={styles.container}>
                {paginatedTasks.map(task => (
                    <Task
                        key={task.taskId}
                        description={task.title}
                        isComplete={task.complete}
                        id={task.taskId}
                        onModalShow={() => onModalShow(task.taskId)}
                        onComplete={() => onComplete(task.taskId)}
                    />
                ))}
            </ul>
        );
    };
};

TaskList.propTypes = {
    paginatedTasks: PropTypes.array.isRequired,
    onComplete: PropTypes.func.isRequired,
    onModalShow: PropTypes.func.isRequired,
};

class Task extends React.Component {
    render() {
        const { onModalShow, onComplete, isComplete, description, id } = this.props;
        const taskTextClass = cn(styles.taskText, { [styles.taskComplete]: isComplete })

        return (
            <li className={styles.task}>
                <button className={styles.buttonComplete} onClick={onComplete}> Complete </button>
                <Link to={`/${id}`}>
                    <div className={taskTextClass}>
                        {description}
                    </div>
                </Link>
                <button className={styles.buttonDelete} onClick={onModalShow}> Delete </button>
            </li>
        );
    };
};

Task.propTypes = {
    onModalShow: PropTypes.func.isRequired,
    onComplete: PropTypes.func.isRequired,
    isComplete: PropTypes.bool,
    description: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
};

Task.defaultProps = {
    isComplete: false,
};

export default TaskList;
