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
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import StarIcon from '@material-ui/icons/Star';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import InfoIcon from '@material-ui/icons/Info';
import Divider from '@material-ui/core/Divider';

const styles = theme => ({
    card: {
        maxWidth: 650,
        minWidth: 520,
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

function SearchItem(props) {

    const { classes } = props;

    return (
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
                        <Typography variant="h6" noWrap
                            style={{ fontWeight: 'bold' }}
                        >
                            <a href={"https://ipfs.io/ipfs/" + props.resource.ipfs_hash} style={{ color: '#3f51b5' }}>{props.resource.title}</a>
                        </Typography>
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
                            [{props.resource.country}]
                        </Typography>
                        <Tooltip
                            title={
                                <React.Fragment>
                                    <Typography variant="body2" noWrap>
                                        <b>Tipo:</b> {props.resource.content_type}
                                    </Typography>
                                    <Typography variant="body2" noWrap>
                                        <b>Versión:</b> {props.resource.version}
                                    </Typography>
                                    <Typography variant="body2" noWrap>
                                        <b>Publicado:</b> {props.resource.created_at}
                                    </Typography>
                                    <Typography variant="body2" noWrap>
                                        <b>Modificado:</b> {props.resource.updated_at}
                                    </Typography>
                                </React.Fragment>
                            }
                            classes={{ tooltip: classes.lightTooltip }}
                            interactive
                            placement="bottom-start"
                        >
                            <IconButton style={{ padding: 10 }}>
                                <InfoIcon style={{ color: 'rgba(0, 0, 0, 0.54)' }} />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
                <Typography variant="h6" style={{ color: '#3f51b5', fontSize: 18 }} noWrap>
                    {props.resource.domain}
                </Typography>
                <Typography variant="body1" style={{ color: '#3f51b5', marginTop: '-5px' }} noWrap>
                    {"/ipfs/" + props.resource.ipfs_hash}
                </Typography>
                <Typography variant="body2" style={{ margin: '5px 0' }}>
                    {props.resource.description}
                </Typography>
                <div style={{ marginBottom: 12 }}>
                    {props.resource.tags.map((tag, i) => {
                        return <Chip key={i} label={tag} style={{ marginRight: 5 }} />
                    })}
                </div>
            </CardContent>
            <Divider />
            <CardActions style={{ padding: 0 }}>
                {props.isRegistered && props.canUserVote ?
                    <div>
                        {props.resource.alreadyVoted ?
                            <IconButton style={{ padding: 10 }} disabled>
                                <ThumbDownIcon style={{ color: 'rgb(63, 81, 181)' }} />
                            </IconButton>
                            :
                            <IconButton onClick={props.voteCallback} style={{ padding: 10 }}>
                                <ThumbDownIcon style={{ color: 'rgba(0, 0, 0, 0.54)' }} />
                            </IconButton>
                        }
                    </div>
                    : undefined}
                {props.resource.alreadyFav ?
                    <IconButton style={{ padding: 6 }} disabled>
                        <StarIcon style={{ fontSize: 32, color: 'rgb(63, 81, 181)' }} />
                    </IconButton>
                    :
                    <IconButton onClick={props.favCallback} style={{ padding: 6 }}>
                        <StarIcon style={{ fontSize: 32, color: 'rgba(0, 0, 0, 0.54)' }} />
                    </IconButton>
                }
                {props.isRegistered && props.view == 'searcher' && !props.isOwner ?
                    <IconButton onClick={props.followCallback} style={{ padding: 7 }}>
                        {props.resource.alreadyFollowing ?
                            <PersonAddIcon style={{ fontSize: 30, color: 'rgb(63, 81, 181)' }} />
                            :
                            <PersonAddIcon style={{ fontSize: 30, color: 'rgba(0, 0, 0, 0.54)' }} />
                        }
                    </IconButton>
                    : undefined}
            </CardActions>
        </Card>
    );
}

SearchItem.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SearchItem);
