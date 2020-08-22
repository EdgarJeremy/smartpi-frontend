import React from 'react';
import { Table } from 'semantic-ui-react';
import moment from 'moment';
import 'moment/locale/id';

export default class Announcement extends React.Component {

    state = {
        announcements: null,
        description: '',
        date: '',
        time: ''
    }

    componentDidMount() {
        this.fetch();
    }

    fetch() {
        const { models } = this.props;
        models.Announcement.collection({ attributes: ['id', 'description', 'date'] }).then((announcements) => {
            this.setState({ announcements });
        });
    }

    onAdd() {
        const { models } = this.props;
        const { description, date, time } = this.state;
        models.Announcement.create({ description, date }).then(() => {
            this.fetch();
            this.form.reset();
            this.setState({ description: '', date: '' });
        });
    }

    onDelete(r) {
        r.delete().then(() => this.fetch());
    }

    render() {
        const { announcements, description, date, time } = this.state;
        return (
            <div>
                <form ref={(f) => this.form = f}>
                    <textarea placeholder="deskripsi pengumuman" value={description} onChange={(e) => this.setState({ description: e.target.value })}></textarea><br />
                    <input type="date" value={date} onChange={(e) => this.setState({ date: e.target.value })} /><br />
                    <input type="time" time={time} onChange={(e) => this.setState({ time: e.target.value })} /><br />
                    <button onClick={this.onAdd.bind(this)} type="button">tambah</button><br />
                </form>
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>ID</Table.HeaderCell>
                            <Table.HeaderCell>Tanggal</Table.HeaderCell>
                            <Table.HeaderCell>Deskripsi</Table.HeaderCell>
                            <Table.HeaderCell>Hapus</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {announcements && announcements.rows.map((d, i) => (
                            <Table.Row key={i}>
                                <Table.Cell>{d.id}</Table.Cell>
                                <Table.Cell>{moment(d.date).format('Do MMMM YYYY, h:mm:ss a')}</Table.Cell>
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