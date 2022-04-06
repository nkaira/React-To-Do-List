import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import cn from "classnames";

import { withUseRouter } from "hoc/withUseRouter";
import styles from "./pagination.module.scss";

class Pagination extends React.Component {
    render() {
        const { pageSize, currentPage, filteredTasks, onClick, setSearchParams, status } = this.props;
        let pageCount = Math.ceil(filteredTasks.length / pageSize);

        return (
            <div>
                {filteredTasks.length > pageSize &&
                    <PaginationButton
                        currentPage={currentPage}
                        pageCount={pageCount}
                        status={status}
                        setSearchParams={setSearchParams}
                        onClick={(page) => onClick(page)}
                    />
                }
            </div>
        );
    };
};

Pagination.propTypes = {
    pageSize: PropTypes.number,
    currentPage: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    filteredTasks: PropTypes.array.isRequired,
    onClick: PropTypes.func.isRequired,
    setSearchParams: PropTypes.func.isRequired,
    status: PropTypes.string,
};

Pagination.defaultProps = {
    pageSize: 3,
    currentPage: 1,
    status: 'FILTER_ALL',
};

class PaginationButton extends React.Component {

    handleClick(page) {
        const { onClick, setSearchParams, status } = this.props;
        setSearchParams({ page, status });
        onClick(page);
    }

    render() {
        const { currentPage } = this.props;
        const pageNumbers = [];
        const page = this.props.pageCount;
        for (let i = 1; i < page + 1; i++) {
            pageNumbers.push(i);
        };

        return (
            <nav className={styles.container}>
                {pageNumbers.map(number => (
                    <button key={number} className={cn(styles.button, { [styles.activeButton]: Number(currentPage) === number })} onClick={() => this.handleClick(number)}>
                        {number}
                    </button>
                ))
                }
            </nav>
        );
    };
};

PaginationButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    setSearchParams: PropTypes.func.isRequired,
    status: PropTypes.string,
};

PaginationButton.defaultProps = {
    status: 'FILTER_ALL',
};

export default withUseRouter(connect(state => ({
    status: state.filterStatusReducer.status,
}),
)(Pagination));