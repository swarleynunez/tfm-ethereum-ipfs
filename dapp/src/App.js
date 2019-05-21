import React from 'react';
import GetWeb3 from './utils/GetWeb3';
import DAppManager from './instances/DAppManager';
import UserContract from './instances/UserContract';
import BlacklistContract from './instances/BlacklistContract';

// UI
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import PersistentDrawerLeft from './components/PersistentDrawerLeft';
import SearchItem from './components/SearchItem';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';

// Utils
const converter = (web3) => {

    return (value) => {
        return web3.utils.fromWei(value, 'ether');
    }
}

// React component
export class App extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            account: undefined,
            anchorEl: null,
            showSearcher: false,
            showInfo: false,
            showLoader: false,
            showFeed: true,
        };

        this.handleOpenMenu = this.handleOpenMenu.bind(this);
        this.handleCloseMenu = this.handleCloseMenu.bind(this);
    }

    // First executed function
    async componentDidMount() {

        // Instances
        this.web3 = await GetWeb3();
        this.manager = await DAppManager(this.web3.currentProvider);

        // Utils
        this.toEther = converter(this.web3);

        // Check permission to access MetaMask accounts
        await this.web3.currentProvider.enable();

        // Get initial account
        let account = (await this.web3.eth.getAccounts())[0];

        // Set initial state and refresh data
        this.setState({
            account: account.toLowerCase()
        }, () => {
            this.refresh();
        });

        // Update data when account is changed in MetaMask
        this.web3.currentProvider.on('accountsChanged', function (accounts) {

            if (accounts[0] !== undefined) {

                this.setState({
                    account: accounts[0].toLowerCase()
                }, () => {
                    this.refresh();
                });
            }
        }.bind(this));

        // Events
        //
    }

    // Second executed function
    async refresh() {

    }

    // Web3 functions
    //

    // Other functions
    handleOpenMenu(event) {

        this.setState({
            anchorEl: event.currentTarget
        });
    }

    handleCloseMenu() {

        this.setState({
            anchorEl: null
        });
    }

    render() {

        const { anchorEl } = this.state;

        return <React.Fragment>
            <PersistentDrawerLeft />
            <div>
                <Button
                    aria-owns={anchorEl ? 'simple-menu' : undefined}
                    aria-haspopup="true"
                    onClick={this.handleOpenMenu}
                    style={{ position: 'absolute', top: 5, right: 3, color: 'rgb(0, 0, 0, 0.54)' }}
                >
                    <MenuIcon style={{ fontSize: 40 }} />
                </Button>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleCloseMenu}
                    disableAutoFocusItem={Boolean(true)}
                    style={{ top: 40 }}
                >
                    <MenuItem onClick={this.handleCloseMenu}>Buscador</MenuItem>
                    <Divider />
                    <MenuItem onClick={this.handleCloseMenu}>Registrarse</MenuItem>
                    <MenuItem onClick={this.handleCloseMenu}>Feed</MenuItem>
                    <MenuItem onClick={this.handleCloseMenu}>Publicar Recurso</MenuItem>
                    <Divider />
                    <MenuItem onClick={this.handleCloseMenu}>Crear Listas Negras</MenuItem>
                </Menu>
            </div>
            {this.state.showSearcher ?
                <Grid item xs={12}
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                    style={{ marginTop: '8%' }}
                >
                    <Typography
                        variant="h2"
                        style={{ fontWeight: 'bold', color: '#3f51b5' }}
                    >
                        <i>Dsearch</i>
                    </Typography>
                    <Paper
                        style={{ marginTop: 30, padding: '4px 4px', display: 'flex', alignItems: 'center', width: 600 }}
                        elevation={1}
                    >
                        <InputBase
                            style={{ marginLeft: 8, flex: 1 }}
                            placeholder="Buscar recurso"
                        />
                        <IconButton
                            style={{ padding: 10 }}
                            aria-label="Search"
                        >
                        </IconButton>
                        <Divider
                            style={{ width: 1, height: 28, margin: 4 }}
                        />
                        <IconButton
                            color="primary"
                            style={{ padding: 10 }}
                            aria-label="Directions"
                        >
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                    {this.state.showInfo ?
                        <Typography
                            variant="body1"
                            style={{ fontWeight: 'bold', marginTop: 80, color: 'rgba(0, 0, 0, 0.54)' }}
                        >
                            Publica y comparte tus archivos con total libertad
                        </Typography>
                        : this.state.showLoader ?
                            <CircularProgress style={{ marginTop: 40 }} />
                            : <Grid item xs={12}
                                container
                                direction="row"
                                justify="center"
                                alignItems="flex-start"
                                style={{ marginTop: 60 }}
                            >
                                <SearchItem
                                    title="MARCA - Diario online líder en información deportiva"
                                    domain="domain.eu.ak"
                                    ipfs="ipfs/QmRW3V9znzFW9M5FYbitSEvd5dQrPWGvPvgQD6LM22Tv8D"
                                    href="https://google.com"
                                    description="La mejor información deportiva en castellano actualizada minuto a minuto en noticias, vídeos, fotos, retransmisiones y resultados en directo."
                                    country="ES"
                                    type="Página Web"
                                    publishedAt="10/05/2019"
                                    version="2"
                                    editedAt="11/05/2019"
                                >
                                    <div style={{ marginBottom: 12 }}>
                                        <Chip label="Etiqueta1" style={{ marginRight: 5 }} />
                                        <Chip label="Etiqueta2" style={{ marginRight: 5 }} />
                                        <Chip label="Etiqueta3" style={{ marginRight: 5 }} />
                                        <Chip label="Etiqueta4" style={{ marginRight: 5 }} />
                                        <Chip label="Etiqueta5" style={{ marginRight: 5 }} />
                                    </div>
                                </SearchItem>
                            </Grid>
                    }
                </Grid>
                : undefined}
            {this.state.showFeed ?
                <Grid item xs={12}
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                >
                    <SearchItem
                        title="MARCA - Diario online líder en información deportiva"
                        domain="domain.eu.ak"
                        ipfs="ipfs/QmRW3V9znzFW9M5FYbitSEvd5dQrPWGvPvgQD6LM22Tv8D"
                        href="https://google.com"
                        description="La mejor información deportiva en castellano actualizada minuto a minuto en noticias, vídeos, fotos, retransmisiones y resultados en directo."
                        country="ES"
                        type="Página Web"
                        publishedAt="10/05/2019"
                        version="2"
                        editedAt="11/05/2019"
                    >
                        <div style={{ marginBottom: 12 }}>
                            <Chip label="Etiqueta1" style={{ marginRight: 5 }} />
                            <Chip label="Etiqueta2" style={{ marginRight: 5 }} />
                            <Chip label="Etiqueta3" style={{ marginRight: 5 }} />
                            <Chip label="Etiqueta4" style={{ marginRight: 5 }} />
                            <Chip label="Etiqueta5" style={{ marginRight: 5 }} />
                        </div>
                    </SearchItem>
                    <SearchItem
                        title="MARCA - Diario online líder en información deportiva"
                        domain="domain.eu.ak"
                        ipfs="ipfs/QmRW3V9znzFW9M5FYbitSEvd5dQrPWGvPvgQD6LM22Tv8D"
                        href="https://google.com"
                        description="La mejor información deportiva en castellano actualizada minuto a minuto en noticias, vídeos, fotos, retransmisiones y resultados en directo."
                        country="ES"
                        type="Página Web"
                        publishedAt="10/05/2019"
                        version="2"
                        editedAt="11/05/2019"
                    >
                        <div style={{ marginBottom: 12 }}>
                            <Chip label="Etiqueta1" style={{ marginRight: 5 }} />
                            <Chip label="Etiqueta2" style={{ marginRight: 5 }} />
                            <Chip label="Etiqueta3" style={{ marginRight: 5 }} />
                            <Chip label="Etiqueta4" style={{ marginRight: 5 }} />
                            <Chip label="Etiqueta5" style={{ marginRight: 5 }} />
                        </div>
                    </SearchItem>
                    <SearchItem
                        title="MARCA - Diario online líder en información deportiva"
                        domain="domain.eu.ak"
                        ipfs="ipfs/QmRW3V9znzFW9M5FYbitSEvd5dQrPWGvPvgQD6LM22Tv8D"
                        href="https://google.com"
                        description="La mejor información deportiva en castellano actualizada minuto a minuto en noticias, vídeos, fotos, retransmisiones y resultados en directo."
                        country="ES"
                        type="Página Web"
                        publishedAt="10/05/2019"
                        version="2"
                        editedAt="11/05/2019"
                    >
                        <div style={{ marginBottom: 12 }}>
                            <Chip label="Etiqueta1" style={{ marginRight: 5 }} />
                            <Chip label="Etiqueta2" style={{ marginRight: 5 }} />
                            <Chip label="Etiqueta3" style={{ marginRight: 5 }} />
                            <Chip label="Etiqueta4" style={{ marginRight: 5 }} />
                            <Chip label="Etiqueta5" style={{ marginRight: 5 }} />
                        </div>
                    </SearchItem>
                    <SearchItem
                        title="MARCA - Diario online líder en información deportiva"
                        domain="domain.eu.ak"
                        ipfs="ipfs/QmRW3V9znzFW9M5FYbitSEvd5dQrPWGvPvgQD6LM22Tv8D"
                        href="https://google.com"
                        description="La mejor información deportiva en castellano actualizada minuto a minuto en noticias, vídeos, fotos, retransmisiones y resultados en directo."
                        country="ES"
                        type="Página Web"
                        publishedAt="10/05/2019"
                        version="2"
                        editedAt="11/05/2019"
                    >
                        <div style={{ marginBottom: 12 }}>
                            <Chip label="Etiqueta1" style={{ marginRight: 5 }} />
                            <Chip label="Etiqueta2" style={{ marginRight: 5 }} />
                            <Chip label="Etiqueta3" style={{ marginRight: 5 }} />
                            <Chip label="Etiqueta4" style={{ marginRight: 5 }} />
                            <Chip label="Etiqueta5" style={{ marginRight: 5 }} />
                        </div>
                    </SearchItem>
                </Grid>
                : undefined}
        </React.Fragment>
    }
}
