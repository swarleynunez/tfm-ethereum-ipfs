import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Grey from '@material-ui/core/colors/grey';

const drawerWidth = 280;

const styles = {
    root: {
        display: 'flex',
    },
    menuButton: {
        marginTop: 3,
        marginLeft: 3,
        padding: 8,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: Grey[300],
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        justifyContent: 'flex-end',
    },
};

class PersistentDrawerLeft extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            open: false,
        };

        this.handleDrawer = this.handleDrawer.bind(this);
    }

    handleDrawer() {

        this.setState({
            open: !this.state.open
        });
    };

    render() {

        const { classes } = this.props;
        const { open } = this.state;

        return (
            <div className={classes.root}>
                <CssBaseline />
                <IconButton
                    onClick={this.handleDrawer}
                    className={classNames(classes.menuButton, open)}
                >
                    <ChevronRightIcon style={{ fontSize: 40 }} />
                </IconButton>
                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="left"
                    open={open}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <div className={classes.drawerHeader}>
                        <IconButton
                            onClick={this.handleDrawer}
                            className={classNames(classes.menuButton)}
                        >
                            <ChevronLeftIcon style={{ fontSize: 40 }} />
                        </IconButton>
                    </div>
                    <Typography
                        variant="h5"
                        style={{ margin: '30px 16px 5px 16px' }}
                    >
                        <b>Favoritos</b>
                    </Typography>

                    <List>
                        {['Nombre de dominio 1', 'Nombre de dominio 2', 'Nombre de dominio 3'].map((domain, i) => (
                            <ListItem button key={domain}>
                                <ListItemText primary={domain} />
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
            </div>
        );
    }
}

PersistentDrawerLeft.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(PersistentDrawerLeft);
