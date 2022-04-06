import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { withUseRouter } from "hoc/withUseRouter";

class TaskDetail extends React.Component {
    constructor(props) {
        super(props);
    };

    goBackHandle() {
        const navigate = this.props.navigate;
        navigate(-1);
    };

    isComplete(task) {
        const status = task?.complete ? 'complete' : 'active';
        return status;
    }

    render() {
        const targetTaskId = Number(this.props.params.taskId);
        const tasks = this.props.tasks;
        const task = tasks.find(task => task.taskId === targetTaskId);
        const taskText = task?.title || '-';
        const isComplete = this.isComplete(task);

        return (
            <div>
                <h1>TASK DETAIL:</h1>
                <h2>TASK STATUS: {task ? isComplete : '-'}</h2>
                <h2>TASK TEXT: {taskText}</h2>
                <button onClick={() => this.goBackHandle()}>Back</button>
            </div>
        );
    };
};

TaskDetail.propTypes = {
    targetTaskId: PropTypes.number,
    tasks: PropTypes.array.isRequired,
};

export default withUseRouter(connect(state => ({
    tasks: state.tasksReducer.tasks,
    filterStatus: state.filterStatusReducer,
}),
)(TaskDetail));

