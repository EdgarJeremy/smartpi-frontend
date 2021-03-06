import React from 'react';
import { Segment, Header, Card, Container, Button, Modal } from 'semantic-ui-react';
import io from 'socket.io-client';
import SiriusAdapter from '@edgarjeremy/sirius.adapter';
import './App.css';
import DetectionHistory from './components/DetectionHistory';
import Agenda from './components/Agenda';
import Announcement from './components/Announcement';

const {
  REACT_APP_SERVER_HOST,
  REACT_APP_SERVER_PORT
} = process.env;

const adapter = new SiriusAdapter(REACT_APP_SERVER_HOST, REACT_APP_SERVER_PORT, localStorage);

const sounds = {
  incoming: [
    new Audio(require(`./sounds/hello.mp3`)),
    new Audio(require(`./sounds/hello2.mp3`)),
    new Audio(require(`./sounds/canihelpyou.mp3`)),
    new Audio(require(`./sounds/hey.mp3`)),
    new Audio(require(`./sounds/hey2.mp3`)),
    new Audio(require(`./sounds/heyheyhey.mp3`)),
    new Audio(require(`./sounds/heyitsme.mp3`)),
    new Audio(require(`./sounds/hi.mp3`)),
    new Audio(require(`./sounds/whatareyoudoing.mp3`)),
    new Audio(require(`./sounds/whoareyou.mp3`)),
  ],
  leave: [
    new Audio(require(`./sounds/goodbye.mp3`)),
    new Audio(require(`./sounds/seeyousoon.mp3`)),
    new Audio(require(`./sounds/goodbye2.mp3`)),
  ]
}

class App extends React.Component {

  state = {
    openCctv: false,
    openDetection: false,
    openAgenda: false,
    openAnnouncement: false,
    liveCctv: '',
    models: null
  }

  componentDidMount() {
    let passcode;
    while (passcode !== 'sirius') {
      passcode = this.askPasscode();
    }
    const socket = io(`${REACT_APP_SERVER_HOST}:${REACT_APP_SERVER_PORT}`);
    socket.on('connect', () => {
      adapter.connect().then((models) => {
        this.setState({ models });
      });
      socket.on('stream', (base64) => {
        this.setState({ liveCctv: base64 });
      });
      socket.on('hello', () => {
        const random = Math.floor(Math.random() * sounds.incoming.length);
        const sfx = sounds.incoming[random];
        sfx.loop = false;
        sfx.play();
        console.log('hello');
      });
      socket.on('goodbye', () => {
        const random = Math.floor(Math.random() * sounds.leave.length);
        const sfx = sounds.leave[random];
        sfx.loop = false;
        sfx.play();
        console.log('goodbye');
      });
    });
    document.onclick = () => {
      console.log('interacted');
      for(const typeSounds of Object.values(sounds)) {
        console.log(typeSounds);
        typeSounds.forEach((sound) => sound.play().then(() => sound.loop = false).then(() => sound.pause()));
      }
    }
  }

  askPasscode() {
    const passcode = prompt('Masukkan passcode');
    return passcode;
  }

  render() {
    const { models } = this.state;
    return (
      <div>
        <Segment color="black" stacked>
          <center>
            <Header as="h1">SMART MIRROR v1.0</Header>
          </center>
        </Segment>
        <Container>
          <Card.Group itemsPerRow={2}>
            <Card className="menu-card" color="olive">
              <img className="col-icon" src="https://img.icons8.com/color/200/000000/wallmount-camera.png" alt="Live CCTV" />
              <Button size="huge" color="olive" labelPosition='right' icon='right chevron' content='Live CCTV' onClick={() => this.setState({ openCctv: true })} />
            </Card>
            <Card className="menu-card" color="red">
              <img className="col-icon" src="https://img.icons8.com/color/200/000000/door-sensor-alarmed.png" alt="Riwayat Deteksi" />
              <Button size="huge" color="red" labelPosition='right' icon='right chevron' content='Riwayat Deteksi' onClick={() => this.setState({ openDetection: true })} />
            </Card>
            <Card className="menu-card" color="blue">
              <img className="col-icon" src="https://img.icons8.com/color/200/000000/spiral-bound-booklet.png" alt="Agenda" />
              <Button size="huge" color="blue" labelPosition='right' icon='right chevron' content='Agenda' onClick={() => this.setState({ openAgenda: true })} />
            </Card>
            <Card className="menu-card" color="yellow">
              <img className="col-icon" src="https://img.icons8.com/fluent/200/000000/commercial.png" alt="Pengumuman" />
              <Button size="huge" color="yellow" labelPosition='right' icon='right chevron' content='Pengumuman' onClick={() => this.setState({ openAnnouncement: true })} />
            </Card>
          </Card.Group>
        </Container>

        <Modal size="large" open={this.state.openCctv} onClose={() => this.setState({ openCctv: false })}>
          <Modal.Header>Live CCTV</Modal.Header>
          <Modal.Content>
            <center>
              <img src={`data:image/jpg;base64,${this.state.liveCctv}`} />
            </center>
          </Modal.Content>
        </Modal>

        <Modal size="large" open={this.state.openDetection} onClose={() => this.setState({ openDetection: false })}>
          <Modal.Header>Riwayat Deteksi</Modal.Header>
          <Modal.Content>
            <DetectionHistory models={models} />
          </Modal.Content>
        </Modal>

        <Modal size="large" open={this.state.openAgenda} onClose={() => this.setState({ openAgenda: false })}>
          <Modal.Header>Agenda</Modal.Header>
          <Modal.Content>
            <Agenda models={models} />
          </Modal.Content>
        </Modal>

        <Modal size="large" open={this.state.openAnnouncement} onClose={() => this.setState({ openAnnouncement: false })}>
          <Modal.Header>Pengumuman</Modal.Header>
          <Modal.Content>
            <Announcement models={models} />
          </Modal.Content>
        </Modal>
      </div>
    )
  }
}

export default App;
