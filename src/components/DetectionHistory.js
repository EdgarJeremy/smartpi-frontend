import React from 'react';
import { Table, Icon, Modal } from 'semantic-ui-react';
import moment from 'moment';
import 'moment/locale/id';

const {
    REACT_APP_SERVER_HOST,
    REACT_APP_SERVER_PORT
} = process.env;

export default class DetectionHistory extends React.Component {

    state = {
        detections: null,
        detection: null
    }

    componentDidMount() {
        const { models } = this.props;
        models.Detection.collection({ attributes: ['id', 'detection_time'] }).then((detections) => {
            this.setState({ detections });
        });
    }

    download() {

    }

    play() {

    }

    render() {
        const { detections, detection, openPlay } = this.state;
        return (
            <div>
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>ID</Table.HeaderCell>
                            <Table.HeaderCell>Waktu Record</Table.HeaderCell>
                            <Table.HeaderCell>Aksi</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {detections && detections.rows.map((d, i) => (
                            <Table.Row key={i}>
                                <Table.Cell>{d.id}</Table.Cell>
                                <Table.Cell>{moment(d.detection_time).format('Do MMMM YYYY, h:mm:ss a')}</Table.Cell>
                                <Table.Cell>
                                    <Icon size="big" style={{ cursor: 'pointer' }} name="play" onClick={() => this.setState({ openPlay: true, detection: d })} />{' '}
                                    <Icon size="big" style={{ cursor: 'pointer' }} name="download" onClick={() => window.open(`${REACT_APP_SERVER_HOST}:${REACT_APP_SERVER_PORT}/detections/${d.id}`)} />
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>

                {(detection && openPlay) && (
                    <Modal size="small" open={openPlay} onClose={() => this.setState({ openPlay: false, detection: null })}>
                        <Modal.Header>Rekaman</Modal.Header>
                        <Modal.Content>
                            <video width="100%" height="500" autoPlay controls>
                                <source src={`${REACT_APP_SERVER_HOST}:${REACT_APP_SERVER_PORT}/detections/${detection.id}`} type="video/mp4" />
                                    Your browser does not support the video tag.
                            </video>
                        </Modal.Content>
                    </Modal>
                )}
            </div>
        );
    }

}