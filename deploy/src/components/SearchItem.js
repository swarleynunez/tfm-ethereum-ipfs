import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import StarIcon from '@material-ui/icons/Star';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import InfoIcon from '@material-ui/icons/Info';

const styles = theme => ({
    card: {
        width: 600,
        backgroundColor: '#fafafa',
        boxShadow: 'none',
        marginBottom: 25,
    },
    cardContent: {
        padding: '2px 16px',
    },
    pos: {
        marginBottom: 12,
    },
    lightTooltip: {
        backgroundColor: 'white',
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 18,
        marginTop: 0,
        padding: 15,
    },
});

class SearchItem extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            openModal: false
        };

        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.pad = (number) => { return number < 10 ? '0' + number : number; }
    }

    handleClickOpen() { this.setState({ openModal: true }); };

    handleClose() { this.setState({ openModal: false }); };

    render() {

        const { classes } = this.props;

        // Parse timestamps
        let createdAt = new Date(this.props.resource.created_at);
        createdAt = this.pad(createdAt.getDate()) + "/" +
            this.pad(createdAt.getMonth() + 1) + "/" +
            createdAt.getFullYear();

        let updatedAt = new Date(this.props.resource.updated_at);
        updatedAt = this.pad(updatedAt.getDate()) + "/" +
            this.pad(updatedAt.getMonth() + 1) + "/" +
            updatedAt.getFullYear();

        return (
            <div>
                <Card className={classes.card}>
                    <CardContent className={classes.cardContent}>
                        <Grid item xs={12}
                            container
                            direction="row"
                            justify="space-between"
                            alignItems="center"
                        >
                            <Grid item xs={10}
                                container
                                direction="row"
                                justify="flex-start"
                                alignItems="center"
                            >
                                {this.props.resource.level <= 1 ?
                                    <Typography
                                        variant="h6"
                                        style={{ fontWeight: 'bold' }}
                                        noWrap
                                    >
                                        <a href={"https://ipfs.io/ipfs/" + this.props.resource.ipfs_hash} style={{ color: '#3f51b5' }}>{this.props.resource.title}</a>
                                    </Typography>
                                    :
                                    <Typography
                                        variant="h6"
                                        onClick={this.handleClickOpen}
                                        style={{ fontWeight: 'bold' }}
                                        noWrap
                                    >
                                        <a href={"javascript:;"} style={{ color: '#3f51b5' }}>{this.props.resource.title}</a>
                                    </Typography>
                                }
                            </Grid>
                            <Grid item xs={2}
                                container
                                direction="row"
                                justify="flex-end"
                                alignItems="center"
                            >
                                <Typography variant="subtitle1" noWrap
                                    style={{ fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.54)' }}
                                >
                                    [{this.props.resource.country}]
                                </Typography>
                                <Tooltip
                                    title={
                                        <React.Fragment>
                                            <Typography variant="body2" noWrap>
                                                <b>Tipo:</b> {this.props.resource.content_type}
                                            </Typography>
                                            <Typography variant="body2" noWrap>
                                                <b>Versión:</b> {this.props.resource.version}
                                            </Typography>
                                            <Typography variant="body2" noWrap>
                                                <b>Publicado:</b> {createdAt}
                                            </Typography>
                                            <Typography variant="body2" noWrap>
                                                <b>Modificado:</b> {updatedAt}
                                            </Typography>
                                        </React.Fragment>
                                    }
                                    classes={{ tooltip: classes.lightTooltip }}
                                    interactive
                                    placement="bottom-start"
                                >
                                    <InfoIcon style={{ marginLeft: 10, color: 'rgba(0, 0, 0, 0.54)' }} />
                                </Tooltip>
                            </Grid>
                        </Grid>
                        <Typography variant="h6" style={{ color: '#3f51b5', fontSize: 18 }} noWrap>
                            {this.props.resource.domain}
                        </Typography>
                        <Typography variant="body1" style={{ color: '#3f51b5', marginTop: '-5px' }} noWrap>
                            {"/ipfs/" + this.props.resource.ipfs_hash}
                        </Typography>
                        <Typography variant="body2" style={{ margin: '5px 0' }}>
                            {this.props.resource.description}
                        </Typography>
                        <div style={{ marginBottom: 12 }}>
                            {this.props.resource.tags.map((tag, i) => {
                                return <Chip key={i} label={tag} style={{ marginRight: 5 }} />
                            })}
                        </div>
                    </CardContent>
                    <Divider />
                    <CardActions style={{ padding: 0 }}>
                        {this.props.isRegistered && this.props.canUserVote ?
                            <div>
                                {this.props.resource.alreadyVoted ?
                                    <IconButton style={{ padding: 10 }} disabled>
                                        <ThumbDownIcon style={{ color: 'rgb(63, 81, 181)' }} />
                                    </IconButton>
                                    :
                                    <IconButton onClick={this.props.voteCallback} style={{ padding: 10 }}>
                                        <ThumbDownIcon style={{ color: 'rgba(0, 0, 0, 0.54)' }} />
                                    </IconButton>
                                }
                            </div>
                            : undefined}
                        <IconButton onClick={this.props.favCallback} style={{ padding: 6 }}>
                            {this.props.resource.alreadyFav ?
                                <StarIcon style={{ fontSize: 32, color: 'rgb(63, 81, 181)' }} />
                                :
                                <StarIcon style={{ fontSize: 32, color: 'rgba(0, 0, 0, 0.54)' }} />
                            }
                        </IconButton>
                        {this.props.isRegistered && this.props.view == 'searcher' && !this.props.isOwner ?
                            <IconButton onClick={this.props.followCallback} style={{ padding: 7 }}>
                                {this.props.resource.alreadyFollowing ?
                                    <PersonAddIcon style={{ fontSize: 30, color: 'rgb(63, 81, 181)' }} />
                                    :
                                    <PersonAddIcon style={{ fontSize: 30, color: 'rgba(0, 0, 0, 0.54)' }} />
                                }
                            </IconButton>
                            : undefined}
                    </CardActions>
                </Card>
                {this.props.resource.level > 1 ?
                    <Dialog
                        open={this.state.openModal}
                        onClose={this.handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            <b>Aviso</b>
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                El recurso <b>{this.props.resource.title}</b> ha sido votado por la comunidad de usuarios como inapropiado.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} color="primary">
                                <b>Cancelar</b>
                            </Button>
                            <Button href={"https://ipfs.io/ipfs/" + this.props.resource.ipfs_hash} color="primary" autoFocus>
                                <b>Acceder</b>
                            </Button>
                        </DialogActions>
                    </Dialog>
                    :
                    undefined}
            </div>
        );
    }
}

SearchItem.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(SearchItem);
