import React from 'react'
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

type PaginatorType = {
    page: number
    count: number
    handleChange: (event: React.ChangeEvent<unknown>, value: number) => void
}

const Paginator = (props: PaginatorType) => {
    const {page, count, handleChange} = props
    return (
        <Stack spacing={2}>
            <Typography>Page: {page}</Typography>
            <Pagination count={count} page={page} onChange={handleChange} color="primary"/>
        </Stack>
    );
}

export default Paginator