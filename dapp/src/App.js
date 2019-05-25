import React from 'react';
import GetWeb3 from './utils/GetWeb3';
import IPFS from 'ipfs';
import CountryList from 'react-select-country-list';

// Contracts
import DAppManager from './instances/DAppManager';
import { ManagerService } from './services/ManagerService';
import UserContract from './instances/UserContract';
import { UserService } from './services/UserService';
import BlacklistContract from './instances/BlacklistContract';
import { BlacklistService } from './services/BlacklistService';

// UI
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import PersistentDrawerLeft from './components/PersistentDrawerLeft';
import { ToastContainer } from 'react-toastr';
import SearchItem from './components/SearchItem';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import Divider from '@material-ui/core/Divider';

// React component
export class App extends React.Component {

    constructor(props) {

        super(props);

        this.state = {

            // Global
            account: undefined,
            isRegistered: false,
            currentView: '',
            deployedBlacklists: [],

            // Searcher
            s_domain: '',
            s_resource: undefined,
            s_showLoader: false,

            // Register
            r_country: '',
            r_showLoader: false,

            // Feed
            f_showLoader: false,

            // Publication
            p_showLoader: false,
            isDomainChosen: false,
            ownedByUser: false,
            domainErrorMsg: '',
            p_domain: '',
            p_country: '',
            p_title: '',
            p_type: '',
            p_description: '',
            p_tag: '',
            p_tags: [],
            p_file: undefined,

            // Blacklists
            b_country: '',
            b_showLoader: false,

            // UI
            anchorEl: null,
        };

        this.handleOpenMenu = this.handleOpenMenu.bind(this);
        this.handleCloseMenu = this.handleCloseMenu.bind(this);
    }

    // First executed function
    async componentDidMount() {

        // Instances
        this.web3 = await GetWeb3();
        this.manager = await DAppManager(this.web3.currentProvider);
        this.managerService = new ManagerService(this.manager, this.web3);

        // Get IPFS passphrase
        let pass = localStorage.getItem("passphrase");

        if (pass == null) {

            this.passphrase = Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12);
            localStorage.setItem('passphrase', this.passphrase);
        }
        else this.passphrase = pass;

        this.ipfs = new IPFS({ pass: this.passphrase });

        // Utils
        this.toastConfig = { timeOut: 2500 };
        this.countries = CountryList().getData();
        this.pad = (number) => { return number < 10 ? '0' + number : number; }

        // Check permission to access MetaMask accounts
        await this.web3.currentProvider.enable();

        // Get initial account
        let account = (await this.web3.eth.getAccounts())[0];

        // Set initial state and refresh data
        this.setState({
            account: account.toLowerCase(),
            currentView: 'searcher',
        }, () => {
            this.refresh();
        });

        // Update data when account is changed in MetaMask
        this.web3.currentProvider.on('accountsChanged', function (accounts) {

            if (accounts[0] !== undefined) {

                this.setState({
                    account: accounts[0].toLowerCase(),
                    currentView: 'searcher',
                }, () => {
                    this.refresh();
                });
            }
        }.bind(this));
    }

    // Second executed function
    async refresh() {

        this.getDeployedBlacklists();
        this.isUserRegistered();
    }

    // ManagerService functions
    async registerUser() {

        let country = this.state.r_country;

        this.setState({ r_showLoader: true });

        try {

            await this.managerService.registerUser(country, this.state.account);

            this.getDeployedBlacklists();

            this.setState({
                currentView: 'searcher',
                isRegistered: true,
                r_showLoader: false,
                r_country: '',
            });

            this.container.success(
                "",
                <b>Usuario registrado con éxito</b>,
                this.toastConfig
            );
        }
        catch (error) {

            this.setState({ r_showLoader: false });

            this.container.error(
                "",
                <b>Error al registrar el usuario</b>,
                this.toastConfig
            );
        }
    }

    async deployNewBlacklist() {

        let country = this.state.b_country;

        this.setState({ b_showLoader: true });

        try {

            await this.managerService.deployNewBlacklist(country, this.state.account);

            this.getDeployedBlacklists();

            this.setState({
                currentView: 'searcher',
                b_showLoader: false,
                b_country: '',
            });

            this.container.success(
                "",
                <b>Listas negras desplegadas con éxito</b>,
                this.toastConfig
            );
        }
        catch (error) {

            this.setState({ b_showLoader: false });

            this.container.error(
                "",
                <b>Error al desplegar las listas negras</b>,
                this.toastConfig
            );
        }
    }

    async getDeployedBlacklists() {

        let deployedBlacklists = await this.managerService.getDeployedBlacklists();
        this.setState({ deployedBlacklists });
    }

    async isUserRegistered() {

        let registered = await this.managerService.isUserRegistered(this.state.account);
        this.setState({ isRegistered: registered });
    }

    async publishNewResource() {

        // User contract
        let uContract = await this.managerService.getUserContractAddress(this.state.account);
        let uInstance = await UserContract(this.web3.currentProvider, uContract);
        let uService = new UserService(uInstance);

        // Validate existing domain and if is owned by current user
        let chosen = await this.managerService.isDomainChosen(this.state.p_domain);
        let owned = false;
        //let owned = await uService.isDomainOwnedByUser(this.state.p_domain);

        this.setState({
            isDomainChosen: chosen,
            ownedByUser: owned,
            domainErrorMsg: (chosen && !owned) ? 'Nombre de dominio ocupado' : '',
        });

        try {

            if (!chosen || owned) {

                this.setState({ p_showLoader: true });

                await this.addResourceToIPFS();

                this.setState({
                    currentView: 'searcher',
                    p_showLoader: false,
                    p_domain: '',
                    isDomainChosen: false,
                    ownedByUser: false,
                    p_country: '',
                    p_title: '',
                    p_type: '',
                    p_description: '',
                    p_tag: '',
                    p_tags: [],
                    p_file: undefined,
                });

                this.container.success(
                    "",
                    <b>Recurso publicado con éxito</b>,
                    this.toastConfig
                );
            }
        }
        catch (error) {

            console.log(error);

            this.setState({ p_showLoader: false });

            this.container.error(
                "",
                <b>Error al publicar el recurso</b>,
                this.toastConfig
            );
        }
    }

    async addResourceToIPFS() {

        const keysList = await this.ipfs.key.list();
        console.log(keysList);

        // Check if update an existing resource or create a new
        if (this.state.ownedByUser) {

            if (keysList.find(key => key.name == this.state.p_domain)) {

                // Editing...
            }
            else throw "Resource key not found in IPFS IndexedDB.";
        }
        else {

            // Add resource to IPFS
            const resourceHash = (await this.ipfs.add(this.state.p_file))[0].hash;
            console.log(resourceHash);

            // Create new DRID
            let drid = new Object();
            drid.domain = this.state.p_domain;
            drid.ipfs_hash = resourceHash;
            drid.version = 1;
            drid.content_type = this.state.p_type;
            drid.owner = this.state.account;
            drid.title = this.state.p_title;
            drid.description = this.state.p_description;
            drid['tags'] = this.state.p_tags;
            drid.created_at = Date.now();
            drid.updated_at = Date.now();
            console.log(JSON.stringify(drid));

            // Add drid to IPFS
            const dridBuffer = IPFS.Buffer.from(JSON.stringify(drid));
            const dridHash = (await this.ipfs.add(dridBuffer))[0].hash;
            console.log(dridHash);

            // Generate new key
            if (!keysList.find(key => key.name == this.state.p_domain)) {

                await this.ipfs.key.gen(this.state.p_domain, { type: 'rsa', size: 2048 });
            }

            // Get IPNS hash for new DRID
            const ipns = await this.ipfs.name.publish(dridHash, { key: this.state.p_domain });
            console.log(ipns);

            // Only the first time
            await this.managerService.publishNewResource(this.state.p_domain, ipns.name, this.state.p_country, this.state.account);
        }

        console.log("FIN!");
    }

    async searchResource() {

        this.setState({ s_showLoader: true });

        // Get resource IPNS hash, country and level
        let resourceSearch = await this.managerService.searchResource(this.state.s_domain);
        console.log(resourceSearch);

        // Resolve IPNS name and get resource IPFS hash
        let ipns = await this.ipfs.name.resolve(resourceSearch.ipnsHash);
        console.log(ipns);

        // Get DRID in string format
        let stringDrid = await this.ipfs.get(ipns.path);
        console.log(stringDrid[0].content.toString('utf8'));

        // Parse DRID into an object
        let resourceObject = JSON.parse(stringDrid[0].content.toString('utf8'));
        console.log(resourceObject);

        // Add and parse fields
        resourceObject.country = resourceSearch.country;
        resourceObject.level = resourceSearch.level;

        let createdAt = new Date(resourceObject.created_at);
        resourceObject.created_at = this.pad(createdAt.getDate()) + "/" +
            this.pad(createdAt.getMonth() + 1) + "/" +
            createdAt.getFullYear();

        let updatedAt = new Date(resourceObject.updated_at);
        resourceObject.updated_at = this.pad(updatedAt.getDate()) + "/" +
            this.pad(updatedAt.getMonth() + 1) + "/" +
            updatedAt.getFullYear();

        this.setState({
            s_showLoader: false,
            s_resource: resourceObject,
        });

        console.log(this.state.s_resource);
    }

    // UserService functions
    //

    // BlacklistService functions
    //

    // UI functions
    handleSearchResource(event) { this.setState({ s_domain: event.target.value }); }

    handleRegisterCountry(event) { this.setState({ r_country: event.target.value }); }

    handleBlacklistsCountry(event) { this.setState({ b_country: event.target.value }); }

    handlePublicationDomain(event) {

        this.setState({
            p_domain: event.target.value,
            isDomainChosen: false,
            ownedByUser: false,
            domainErrorMsg: '',
        });
    }

    handlePublicationCountry(event) { this.setState({ p_country: event.target.value }); }

    handlePublicationTitle(event) { this.setState({ p_title: event.target.value }); }

    handlePublicationType(event) { this.setState({ p_type: event.target.value }); }

    handlePublicationDescription(event) { this.setState({ p_description: event.target.value }); }

    handlePublicationTags(event) { this.setState({ p_tag: event.target.value }); }

    handlePublicationFiles(event) { this.setState({ p_file: event.target.files[0] }); }

    handleAddChip() {

        if (this.state.p_tag &&
            this.state.p_tags.length < 5 &&
            !this.state.p_tags.includes(this.state.p_tag)) {

            let newTagsArray = this.state.p_tags;
            newTagsArray.push(this.state.p_tag);

            this.setState({ p_tags: newTagsArray });
        }

        this.setState({ p_tag: '' });
    }

    handleDeleteChip(tag) {

        this.setState({
            p_tags: this.state.p_tags.filter(function (item) {
                return item !== tag
            })
        });
    }

    handleOpenMenu(event) { this.setState({ anchorEl: event.currentTarget }); }

    handleCloseMenu(toView) {

        if (toView == this.state.currentView || toView == undefined) {

            this.setState({ anchorEl: null });
        }
        else {

            this.setState({
                currentView: toView,
                anchorEl: null,
            });
        }
    }

    // View
    render() {

        const { anchorEl } = this.state;

        return <React.Fragment>

            <PersistentDrawerLeft />

            <div>
                <Button
                    aria-owns={anchorEl ? 'simple-menu' : undefined}
                    aria-haspopup="true"
                    onClick={event => this.handleOpenMenu(event)}
                    style={{ position: 'absolute', top: 5, right: 3, color: 'rgb(0, 0, 0, 0.54)' }}
                >
                    <MenuIcon style={{ fontSize: 40 }} />
                </Button>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => this.handleCloseMenu(undefined)}
                    disableAutoFocusItem={Boolean(true)}
                    style={{ top: 40 }}
                >
                    <MenuItem
                        onClick={() => this.handleCloseMenu('searcher')}
                        selected={this.state.currentView == 'searcher'}
                    >
                        Buscador
                    </MenuItem>
                    {!this.state.isRegistered ?
                        <MenuItem
                            onClick={() => this.handleCloseMenu('register')}
                            selected={this.state.currentView == 'register'}
                        >
                            Registrarse
                    </MenuItem>
                        : undefined}
                    <MenuItem
                        onClick={() => this.handleCloseMenu('feed')}
                        selected={this.state.currentView == 'feed'}
                        disabled={!this.state.isRegistered}
                    >
                        Feed
                    </MenuItem>
                    <MenuItem
                        onClick={() => this.handleCloseMenu('publication')}
                        selected={this.state.currentView == 'publication'}
                        disabled={!this.state.isRegistered}
                    >
                        Publicar Recurso
                    </MenuItem>
                    <Divider />
                    <MenuItem
                        onClick={() => this.handleCloseMenu('blacklists')}
                        selected={this.state.currentView == 'blacklists'}
                    >
                        Crear Listas Negras
                    </MenuItem>
                </Menu>
            </div>

            {this.state.currentView == 'searcher' ?
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
                            onChange={event => this.handleSearchResource(event)}
                        />
                        <Divider
                            style={{ width: 1, height: 28, margin: 4 }}
                        />
                        <IconButton
                            color="primary"
                            style={{ padding: 10 }}
                            aria-label="Directions"
                            onClick={() => this.searchResource()}
                        >
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                    {!this.state.s_showLoader && !this.state.s_resource ?
                        <Typography
                            variant="body1"
                            style={{ fontWeight: 'bold', marginTop: 80, color: 'rgba(0, 0, 0, 0.54)' }}
                        >
                            Publica y comparte tus archivos con total libertad
                        </Typography>
                        : undefined}
                    <Grid item xs={12}
                        container
                        direction="row"
                        justify="center"
                        alignItems="flex-start"
                        style={{ marginTop: 60 }}
                    >
                        {this.state.s_resource && !this.state.s_showLoader ?
                            <SearchItem
                                title={this.state.s_resource.title}
                                domain={this.state.s_resource.domain}
                                ipfs={this.state.s_resource.ipfs_hash}
                                href={this.state.s_resource.ipfs_hash}
                                description={this.state.s_resource.description}
                                country={this.state.s_resource.country}
                                type={this.state.s_resource.content_type}
                                version={this.state.s_resource.version}
                                created_at={this.state.s_resource.created_at}
                                updated_at={this.state.s_resource.updated_at}
                                view="searcher"
                            >
                                <div style={{ marginBottom: 12 }}>
                                    <Chip label="Etiqueta1" style={{ marginRight: 5 }} />
                                </div>
                            </SearchItem>
                            : undefined}
                        {this.state.s_showLoader ? <CircularProgress style={{ marginTop: 10 }} /> : undefined}
                    </Grid>
                </Grid>
                : undefined}

            {this.state.currentView == 'register' ?
                <Grid item xs={12}
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                >
                    <TextField
                        select
                        SelectProps={{ native: true }}
                        margin="normal"
                        variant="outlined"
                        required={Boolean(true)}
                        onChange={event => this.handleRegisterCountry(event)}
                        value={this.state.r_country}
                        disabled={this.state.r_showLoader}
                        style={{ minWidth: 300 }}
                    >
                        <option key={0} value="" disabled>Elige un país</option>
                        {this.countries.map((country, i) => {
                            if (this.state.deployedBlacklists.includes(country.value)) {
                                return <option key={i + 1} value={country.value}>{country.label}</option>
                            }
                        })}
                    </TextField>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => this.registerUser()}
                        style={{ height: 45, marginTop: 50 }}
                        disabled={!this.state.r_country}
                    >
                        <b>Registrarse</b>
                        <PersonAddIcon style={{ fontSize: 25, marginLeft: 12 }} />
                    </Button>
                    {this.state.r_showLoader ? <CircularProgress style={{ marginTop: 10 }} /> : undefined}
                </Grid>
                : undefined}

            {this.state.currentView == 'feed' ?
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
                        version="2"
                        created_at="10/05/2019"
                        updated_at="11/05/2019"
                        view="feed"
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
                        version="2"
                        created_at="10/05/2019"
                        updated_at="11/05/2019"
                        view="feed"
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
                        version="2"
                        created_at="10/05/2019"
                        updated_at="11/05/2019"
                        view="feed"
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
                        version="2"
                        created_at="10/05/2019"
                        updated_at="11/05/2019"
                        view="feed"
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

            {this.state.currentView == 'publication' ?
                <Grid item xs={12}
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                >
                    <Grid item xs={12}
                        container
                        direction="row"
                        justify="center"
                        alignItems="center"
                    >
                        <TextField
                            type="text"
                            label="Dominio"
                            error={this.state.isDomainChosen && !this.state.ownedByUser}
                            helperText={this.state.domainErrorMsg}
                            margin="normal"
                            variant="outlined"
                            autoFocus={Boolean(true)}
                            required={Boolean(true)}
                            inputProps={{ maxLength: 30 }}
                            onChange={event => this.handlePublicationDomain(event)}
                            value={this.state.p_domain}
                            disabled={this.state.p_showLoader}
                            style={{ width: '40%', marginRight: '5%' }}
                        />
                        <TextField
                            select
                            SelectProps={{ native: true }}
                            margin="normal"
                            variant="outlined"
                            required={Boolean(true)}
                            onChange={event => this.handlePublicationCountry(event)}
                            value={this.state.p_country}
                            disabled={this.state.p_showLoader}
                            style={{ width: '25%' }}
                        >
                            <option key={0} value="" disabled>Elige un país</option>
                            {this.countries.map((country, i) => {
                                if (this.state.deployedBlacklists.includes(country.value)) {
                                    return <option key={i + 1} value={country.value}>{country.label}</option>
                                }
                            })}
                        </TextField>
                    </Grid>
                    <Grid item xs={12}
                        container
                        direction="row"
                        justify="center"
                        alignItems="center"
                    >
                        <TextField
                            type="text"
                            label="Título"
                            margin="normal"
                            variant="outlined"
                            required={Boolean(true)}
                            inputProps={{ maxLength: 80 }}
                            onChange={event => this.handlePublicationTitle(event)}
                            value={this.state.p_title}
                            disabled={this.state.p_showLoader}
                            style={{ width: '40%', marginRight: '5%' }}
                        />
                        <TextField
                            select
                            SelectProps={{ native: true }}
                            margin="normal"
                            variant="outlined"
                            required={Boolean(true)}
                            onChange={event => this.handlePublicationType(event)}
                            value={this.state.p_type}
                            disabled={this.state.p_showLoader}
                            style={{ width: '25%' }}
                        >
                            <option key={0} value="" disabled>Elige un tipo</option>
                            <option key={1} value="Página Web">Página Web</option>
                            <option key={2} value="Imagen">Imagen</option>
                            <option key={3} value="Vídeo">Vídeo</option>
                            <option key={4} value="Documento">Documento</option>
                        </TextField>
                    </Grid>
                    <Grid item xs={12}
                        container
                        direction="row"
                        justify="center"
                        alignItems="baseline"
                    >
                        <TextField
                            multiline
                            rows="5"
                            type="text"
                            label="Descripción"
                            margin="normal"
                            variant="outlined"
                            required={Boolean(true)}
                            inputProps={{ maxLength: 300 }}
                            onChange={event => this.handlePublicationDescription(event)}
                            value={this.state.p_description}
                            disabled={this.state.p_showLoader}
                            style={{ width: '40%', marginRight: '5%' }}
                        />
                        <Grid
                            container
                            direction="column"
                            justify="center"
                            alignItems="flex-start"
                            style={{ width: '25%' }}
                        >
                            <Grid item xs={12}
                                container
                                direction="row"
                                justify="space-between"
                                alignItems="center"
                                style={{ marginBottom: 5 }}
                            >
                                <TextField
                                    type="text"
                                    label="Etiqueta"
                                    margin="none"
                                    variant="outlined"
                                    required={Boolean(true)}
                                    inputProps={{ maxLength: 20 }}
                                    onChange={event => this.handlePublicationTags(event)}
                                    value={this.state.p_tag}
                                    disabled={this.state.p_showLoader}
                                    style={{ width: '80%' }}
                                />
                                <Grid
                                    container
                                    direction="column"
                                    justify="center"
                                    alignItems="center"
                                    style={{ width: '20%' }}
                                >
                                    <IconButton
                                        onClick={() => this.handleAddChip()}
                                        disabled={this.state.p_showLoader}
                                        style={{ padding: 6 }}
                                    >
                                        <AddIcon style={{ fontSize: 32, color: 'rgba(0, 0, 0, 0.54)' }} />
                                    </IconButton>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}
                                container
                                direction="row"
                                justify="flex-start"
                                alignItems="flex-start"
                            >
                                {this.state.p_tags.map((tag, i) => {
                                    return <Chip key={i} label={tag} onDelete={() => this.handleDeleteChip(tag)} style={{ margin: '3px 3px 0 0' }} />
                                })}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}
                        container
                        direction="column"
                        justify="center"
                        alignItems="center"
                    >
                        <input
                            type="file"
                            id="upload-files-button"
                            required={Boolean(true)}
                            onChange={event => this.handlePublicationFiles(event)}
                            disabled={this.state.p_showLoader}
                            style={{ display: 'none' }}
                        />
                        <label
                            htmlFor="upload-files-button"
                            style={{ marginBottom: 0 }}
                        >
                            <Button
                                variant="contained"
                                component="span"
                                color="default"
                                size="medium"
                                style={{ height: 45, marginTop: 15, position: 'absolute', left: '15%' }}
                            >
                                Añadir Archivo
                            </Button>
                        </label>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => this.publishNewResource()}
                            disabled={
                                !this.state.p_domain ||
                                !this.state.p_country ||
                                !this.state.p_title ||
                                !this.state.p_type ||
                                !this.state.p_description ||
                                this.state.p_tags.length < 3 ||
                                !this.state.p_file ||
                                this.state.p_showLoader
                            }
                            style={{ height: 45, marginTop: 100 }}
                        >
                            <b>Publicar Recurso</b>
                            <CloudUploadIcon style={{ fontSize: 25, marginLeft: 12 }} />
                        </Button>
                        {this.state.p_showLoader ? <CircularProgress style={{ marginTop: 10 }} /> : undefined}
                    </Grid>
                </Grid>
                : undefined}

            {this.state.currentView == 'blacklists' ?
                <Grid item xs={12}
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                >
                    <TextField
                        select
                        SelectProps={{ native: true }}
                        margin="normal"
                        variant="outlined"
                        required={Boolean(true)}
                        onChange={event => this.handleBlacklistsCountry(event)}
                        value={this.state.b_country}
                        disabled={this.state.b_showLoader}
                        style={{ minWidth: 350 }}
                    >
                        <option key={0} value="" disabled>Elige un país</option>
                        {this.countries.map((country, i) => {
                            if (!this.state.deployedBlacklists.includes(country.value)) {
                                return <option key={i + 1} value={country.value}>{country.label}</option>
                            }
                        })}
                    </TextField>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => this.deployNewBlacklist()}
                        style={{ height: 45, marginTop: 50 }}
                        disabled={!this.state.b_country}
                    >
                        <b>Crear Listas Negras</b>
                        <PlaylistAddIcon style={{ fontSize: 30, marginLeft: 12 }} />
                    </Button>
                    {this.state.b_showLoader ? <CircularProgress style={{ marginTop: 10 }} /> : undefined}
                </Grid>
                : undefined}

            <ToastContainer ref={(ref) => this.container = ref} className="toast-bottom-right" />

        </React.Fragment>
    }
}
