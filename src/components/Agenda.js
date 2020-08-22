import React from 'react';
import { Table } from 'semantic-ui-react';
import moment from 'moment';
import 'moment/locale/id';

const {
    REACT_APP_SERVER_HOST,
    REACT_APP_SERVER_PORT
} = process.env;

export default class Agenda extends React.Component {

    state = {
        agendas: null,
        description: '',
        date: '',
        time: ''
    }

    componentDidMount() {
        this.fetch();
    }

    fetch() {
        const { models } = this.props;
        models.Agenda.collection({ attributes: ['id', 'description', 'date', 'time'] }).then((agendas) => {
            this.setState({ agendas });
        });
    }

    onAdd() {
        const { models } = this.props;
        const { description, date, time } = this.state;
        models.Agenda.create({ description, date, time }).then(() => {
            this.fetch();
            this.form.reset();
            this.setState({ description: '', date: '', time: '' });
        });
    }

    onDelete(r) {
        r.delete().then(() => this.fetch());
    }

    render() {
        const { agendas, description, date, time } = this.state;
        return (
            <div>
                <form ref={(f) => this.form = f}>
                    <textarea placeholder="deskripsi agenda" value={description} onChange={(e) => this.setState({ description: e.target.value })}></textarea><br />
                    <input type="date" value={date} onChange={(e) => this.setState({ date: e.target.value })} /><br />
                    <input type="time" time={time} onChange={(e) => this.setState({ time: e.target.value })} /><br />
                    <button onClick={this.onAdd.bind(this)} type="button">tambah</button><br />
                </form>
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>ID</Table.HeaderCell>
                            <Table.HeaderCell>Tanggal</Table.HeaderCell>
                            <Table.HeaderCell>Waktu</Table.HeaderCell>
                            <Table.HeaderCell>Deskripsi</Table.HeaderCell>
                            <Table.HeaderCell>Hapus</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {agendas && agendas.rows.map((d, i) => (
                            <Table.Row key={i}>
                                <Table.Cell>{d.id}</Table.Cell>
                                <Table.Cell>{moment(d.date).format('Do MMMM YYYY, h:mm:ss a')}</Table.Cell>
                                <Table.Cell>{d.time}</Table.Cell>
                                <Table.Cell>{d.description}</Table.Cell>
                                <Table.Cell>
                                    (<a href="#" onClick={() => this.onDelete(d)}>x</a>)
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
        );
    }

}