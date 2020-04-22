import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import HomeIcon from '@material-ui/icons/Home';
import NotesIcon from '@material-ui/icons/Notes';
import PermMediaIcon from '@material-ui/icons/PermMedia';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import Box from '@material-ui/core/Box';

const styles = {
	stickToBottom: {
		width: '100%',
		position: 'fixed', // try: sticky or absolute
		bottom: 0,
	},
};

const pathMap = {
	'/':	 	0,
	'/Home':	0,
	'/notes':	1,
	'/files':	2,
}

class BottomNav extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			pathIndex: 0,  // Current page index
		}
	}

	
	static getDerivedStateFromProps(nextProps, prevState) {
		const {pathname} = nextProps.location;
		const newPathIndex = pathMap[pathname];
		return { pathIndex: newPathIndex };
	}
	
	render() {
		const { classes } = this.props;
		return (
			<Box boxShadow={2} className={classes.stickToBottom} >
			<BottomNavigation showLabels
			value={this.state.pathIndex}
			onChange={(event, newValue) => {
				this.setState({ pathIndex: newValue });
			}}>
			<BottomNavigationAction label="Home" icon={<HomeIcon />}
			component={RouterLink} to='/' />
			<BottomNavigationAction label="Notes" icon={<NotesIcon />}
			component={RouterLink} to='/notes' />
			<BottomNavigationAction label="Files" icon={<PermMediaIcon />}
			component={RouterLink} to='/files' />
			</BottomNavigation>
			</Box>
			);
	}
}
export default withRouter(withStyles(styles)(BottomNav));