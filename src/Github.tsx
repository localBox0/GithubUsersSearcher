import React, {useEffect, useState} from 'react'
import s from './github.module.css'
import axios from "axios";
import {
    Avatar,
    List,
    Button,
    Box,
    ListItemButton,
    TextField,
    Typography,
    Card,
    CardMedia,
    CardContent
} from "@mui/material";
import TimelapseIcon from '@mui/icons-material/Timelapse';
import Paginator from "./Paginator";

type SearchUserType = {
    login: string
    id: number
    avatar_url?: string
}
type SearchResult = {
    items: SearchUserType[]
}
type UserType = {
    login: string
    id: number
    avatar_url: string
    followers: number
}

type SearchPropsType = {
    value: string
    onSubmit: (fixedValue: string) => void
}
export const Search = (props: SearchPropsType) => {
    const [tempSearch, setTempSearch] = useState('')

    useEffect(() => {
        setTempSearch(props.value)
    }, [props.value])

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
        }}>
            <TextField id="outlined-basic" label="Search here..." variant="outlined" size="small" value={tempSearch}
                       onChange={(e) => {
                           setTempSearch(e.currentTarget.value)
                       }}/>
            <Button onClick={() => {
                props.onSubmit(tempSearch)
            }} variant="outlined">Find</Button>
        </Box>
    )
}

type UsersListPropsType = {
    term: string
    selectedUser: SearchUserType | null
    onUserSelect: (user: SearchUserType) => void
}
export const UsersList = (props: UsersListPropsType) => {
    const [users, setUsers] = useState<SearchUserType[]>([])
    const [page, setPage] = React.useState(1);
    const usersPerPage = 5
    const count = Math.ceil(users.length / usersPerPage)
    const lastUserIndex = page * usersPerPage
    const firstUsersIndex = lastUserIndex - usersPerPage
    let currentUsers = [...users].slice(firstUsersIndex, lastUserIndex)
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    useEffect(() => {
        axios
            .get<SearchResult>(`https://api.github.com/search/users?q=${props.term}`)
            .then(res => {
                setUsers(res.data.items)
            })
    }, [props.term])

    return (
        <div>
            <List>
                {currentUsers.map(u =>

                    <ListItemButton key={u.id} className={props.selectedUser === u ? s.selected : ''} onClick={() => {
                        props.onUserSelect(u)
                    }}>
                        <Avatar
                            alt={`Avatar n°${u.id}`}
                            src={u.avatar_url}
                        />
                        {u.login}</ListItemButton>)}

            </List>
            <Paginator page={page} count={count} handleChange={handleChange}/>
        </div>
    )
}

type TimerPropsType = {
    seconds: number
    onChange: (actualSeconds: number) => void
    timerKey: number
}
export const Timer = (props: TimerPropsType) => {
    const [seconds, setSeconds] = useState(props.seconds)
    useEffect(() => {
        setSeconds(props.seconds)
    }, [props.seconds])
    useEffect(() => {
        props.onChange(seconds)
    }, [seconds])
    useEffect(() => {
        const intervalId = setInterval(() => {
            console.log('tick')
            setSeconds((prev) => prev - 1)
        }, 1000)

        return () => {
            clearInterval(intervalId)
        }
    }, [props.timerKey])

    return <Box>
        <Typography variant="h5" gutterBottom sx={{
            display: 'flex',
            alignItems: 'center',
        }}>
            <TimelapseIcon color="primary"/> {seconds}
        </Typography>
    </Box>
}

type UserDetailsPropsType = {
    user: SearchUserType | null
}
const startTimerSeconds = 10
export const UserDetails = (props: UserDetailsPropsType) => {
    const [userDetails, setUserDetails] = useState<null | UserType>(null)
    const [seconds, setSeconds] = useState(startTimerSeconds)
    useEffect(() => {
        if (!!props.user) {
            axios
                .get<UserType>(`https://api.github.com/users/${props.user.login}`)
                .then(res => {
                    setSeconds(startTimerSeconds)
                    setUserDetails(res.data)
                })
        }
    }, [props.user])
    useEffect(() => {
        if (seconds < 1) {
            setUserDetails(null)
        }
    }, [seconds])
    return <div>
        {userDetails && <div>
            <Card sx={{width: 400}}>
                <CardContent>
                    <Timer seconds={seconds} onChange={setSeconds} timerKey={userDetails.id}/>
                    <Typography variant="h4" gutterBottom>
                        {userDetails.login}
                    </Typography>
                    <CardMedia
                        sx={{height: 400}}
                        image={userDetails.avatar_url}
                        title={userDetails.login}
                    />
                    <Typography variant="h6" gutterBottom>
                        Followers: {userDetails.followers}
                    </Typography>
                </CardContent>
            </Card>
        </div>}
    </div>
}

export const Github = () => {
    let initialSearchState = 'IT';

    const [selectedUser, setSelectedUser] = useState<SearchUserType | null>(null)
    const [searchTerm, setSearchTerm] = useState(initialSearchState)

    useEffect(() => {
        if (selectedUser) {
            document.title = selectedUser.login
        }
    }, [selectedUser])

    return <div className={s.container}>
        <div>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
            }}>
                <Search value={searchTerm} onSubmit={(value: string) => {
                    setSearchTerm(value)
                }}/>
                <Button variant="contained" onClick={() => setSearchTerm(initialSearchState)}>Reset</Button>
            </Box>
            <UsersList term={searchTerm} selectedUser={selectedUser} onUserSelect={setSelectedUser}/>
        </div>
        <UserDetails user={selectedUser}/>
    </div>
}
