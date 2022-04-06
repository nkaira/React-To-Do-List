import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Pagination from "components/Pagination/Pagination";
import FilterPanel from "components/FilterPanel/FilterPanel";
import ControlPanel from "components/ControlPanel/ControlPanel";
import TaskList from "components/TaskList/TaskList";
import Modal from "components/Modal/Modal"
import {
    addTaskAction, removeTaskAction, completeTaskAction,
    completeAllAction, deleteAllAction,
} from "store/tasks/tasksActions";
import {
    setPageAction, setPageStatusAction, setFilterStatus
} from "store/filter/filterActions";
import { FILTER_ALL, FILTER_COMPLETE, FILTER_ACTIVE } from "store/filter/filterReducer";

class ToDoList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            isOpen: false,
            targetTaskId: null,
        };
    };

    handleInput(event) {
        this.setState({ inputValue: event.target.value });
    };

    handleAdd = () => {
        const { inputValue } = this.state;
        this.props.addTaskAction({
            taskId: Date.now(),
            title: inputValue,
            complete: false,
        });
        this.setState({ inputValue: '' });
    };

    handlePaginationButton(page) {
        this.props.setPageAction(page);
    };

    handleCompleteTask(targetId) {
        const status = this.props.filterStatus.status;
        this.props.completeTaskAction(targetId);
        if (status === FILTER_ALL) {
            return;
        }
        this.setCurrentPage();
    };

    handleModalShow(targetId) {
        this.setState({ isOpen: true, targetTaskId: targetId });
    }

    handleModalCancel = () => {
        this.setState({ isOpen: false, targetTaskId: null });
    }

    handleModalOk = () => {
        const targetId = this.state.targetTaskId;
        this.props.removeTaskAction(targetId);
        this.setCurrentPage();
        this.setState({ isOpen: false, targetTaskId: null });
    };

    handleDeleteAll = () => {
        const filterStatus = FILTER_ALL;
        const page = 1;
        this.props.deleteAllAction();
        this.props.setPageStatusAction(filterStatus, page);
    };

    handleCompleteAll = () => {
        this.props.completeAllAction();
    };

    handleChangeFilter = (status) => {
        this.props.setFilterStatus(status);
        this.props.setPageAction(1);
    }

    setCurrentPage() {
        const tasks = this.props.tasks.tasks;
        const { currentPage } = this.props.filterStatus;
        const filteredTasks = this.getFilteredTasks(tasks);
        const paginatedTasks = this.getPaginatedTasks(filteredTasks);
        const page = (paginatedTasks.length - 1 === 0) ? currentPage - 1 : currentPage;
        this.props.setPageAction(page);
    };

    getFilteredTasks(tasks) {
        const status = this.props.filterStatus.status;
        let filteredTasks;
        if (status === FILTER_ALL) {
            filteredTasks = tasks;
        } else if (status === FILTER_ACTIVE) {
            filteredTasks = tasks.filter(task => {
                if (task.complete === false) {
                    return task;
                };
            });
        } else if (status === FILTER_COMPLETE) {
            filteredTasks = tasks.filter(task => {
                if (task.complete === true) {
                    return task;
                };
            });
        };
        return filteredTasks;
    };

    getPaginatedTasks(filteredTasks) {
        const { pageSize, currentPage } = this.props.filterStatus;
        const prevPage = currentPage - 1;
        const start = pageSize * prevPage;
        const end = start + pageSize;
        const paginatedItems = filteredTasks.slice(start, end);
        return paginatedItems;
    };

    render() {
        const { inputValue } = this.state;
        const tasks = this.props.tasks.tasks;
        const { currentPage, pageSize } = this.props.filterStatus;
        const filteredTasks = this.getFilteredTasks(tasks);
        const paginatedTasks = this.getPaginatedTasks(filteredTasks);

        return (
            <div>
                <ControlPanel
                    onAdd={this.handleAdd}
                    onInput={(event) => this.handleInput(event)}
                    onDeleteAll={this.handleDeleteAll}
                    onCompleteAll={this.handleCompleteAll}
                    inputValue={inputValue}
                />
                <TaskList
                    onModalShow={(taskId) => this.handleModalShow(taskId)}
                    paginatedTasks={paginatedTasks}
                    onComplete={(taskId) => this.handleCompleteTask(taskId)}
                />
                <Pagination
                    currentPage={currentPage}
                    pageSize={pageSize}
                    filteredTasks={filteredTasks}
                    onClick={(page) => this.handlePaginationButton(page)}
                />
                <FilterPanel
                    onChange={this.handleChangeFilter}
                />
                {this.state.isOpen &&
                    <Modal
                        onCancel={this.handleModalCancel}
                        onOk={this.handleModalOk}
                    />
                }
            </div>
        );
    };
};

ToDoList.propTypes = {
    inputValue: PropTypes.string,
    tasks: PropTypes.object.isRequired,
    currentPage: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
};

ToDoList.defaultProps = {
    currentPage: 1,
    pageSize: 3,
};

export default connect(state => ({
    tasks: state.tasksReducer,
    filterStatus: state.filterStatusReducer,
}),
    {
        addTaskAction, removeTaskAction, completeTaskAction,
        deleteAllAction, completeAllAction, setPageStatusAction,
        setPageAction, setFilterStatus
    }
)(ToDoList);