'use client';
import Image from "next/image";
import { Add, Delete } from '@mui/icons-material';
import { useState, useEffect } from "react";
import {firestore} from "@/firebase";
import {Box, Typography, Modal, Stack, TextField, Button} from "@mui/material";
import { collection, getDoc, getDocs, query, doc, setDoc, deleteDoc } from "firebase/firestore";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

export default function Home() {
  const [pantry, setPantry] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')

  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (event) => {
    setSearchQuery(event.target.value)
  }

  const filteredPantry = pantry.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, 'pantry'))
    const docs = await getDocs(snapshot)
    const pantryList = []
    docs.forEach((doc)=>{
      pantryList.push({
        name: doc.id,
        ...doc.data()
      })
    })
    setPantry(pantryList)
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()) {
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    }
    else {
      await setDoc(docRef, {quantity: 1})
    }
    
    await updatePantry()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()) {
      const {quantity} = docSnap.data()
      if (quantity == 1){
        await deleteDoc(docRef)
      }
      else {
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }

    await updatePantry()
  }

  useEffect(() => {
    updatePantry()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box 
    width="100vw" 
    height="100vw"
    gap={7}
    bgcolor="#1E1E1E"
    >

      {/* Top bar */}
      <Box 
        width="100vw"
        height="60px"
        bgcolor="#2C2C2C"
        display="flex"
        alignItems="center"
        paddingLeft={4}
      >
        <Typography variant="h6" color="#E0E0E0">
          Pantry Inventory Manager
        </Typography>

        <Box flexGrow={1} />

        <Typography variant="h6" color="#E0E0E0" paddingRight={4}>
          &reg; Ryan Reed
        </Typography>
      </Box>

      {/* Add new item pop-up */}
      <Modal open={open} onClose={handleClose}>
        <Box 
          position="absolute" 
          top="50%" 
          left="50%"
          width={400}
          bgcolor="#2C2C2C"
          border="2px solid black"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          borderRadius="20px"
          gap={3}
          sx={{
            transform: 'translate(-50%,-50%)',
          }}
        >
          <Typography variant="h6" sx={{ color: "#E0E0E0" }}>Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant='outlined'
              fullWidth
              value={itemName}
              onChange={(e)=>{
                setItemName(e.target.value)
              }}
            />
            <Button
              variant="outlined" onClick={()=>{
                addItem(itemName.toLowerCase())
                setItemName('')
                handleClose()
              }}> Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* ADD NEW ITEM button */}
      <Box
        padding={5}
        flexDirection="column"
        alignItems="center"
        display="flex"
      >
        <Box 
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width={800}
        >
          <Button 
          variant="contained"
          onClick={()=>{
            handleOpen()
          }}
        >
          Add New Item
        </Button>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search"
          onChange={handleSearch}
          sx={{ bgcolor: '#FFFFFF', borderRadius: '4px' }}
        />
        </Box>
      </Box>

      {/* Pantry items table */}
      <Box>
        <TableContainer component={Box}>
          <Table
          aria-label="simple table"
          sx={{ 
            width: '800px',
            borderRadius: '8px', 
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.4)', 
            overflow: 'hidden',
            margin: '0 auto'
          }}
          >
            <TableHead>
              <TableRow bgcolor="#2F4F8F">
                <TableCell sx={{ color: '#E0E0E0'}}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography paddingLeft="20px">
                      <b>Item</b>
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center" sx={{ color: '#E0E0E0' }}>
                  <b>Quantity</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPantry.map(({name, quantity}, index) => (
                <TableRow
                  key={name}
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 }, 
                    backgroundColor: index % 2 === 0 ? '#2D2D2D' : '#3A3A3A', 
                    '&:hover': { backgroundColor: '#171717' },
                    transition: 'background-color 0.3s'
                  }}
                >
                  <TableCell component="th" scope="row">
                    <Typography variant="h6" sx={{ color: '#E0E0E0', paddingLeft: '20px' }}>
                      {/* Capitalize the first letter of each word */}
                      <b>{name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</b>
                    </Typography>
                    <Stack direction="row" spacing={1} justifyContent="right" marginBottom={1}>
                      <Button 
                        variant="contained"
                        size="small"
                        sx={{ borderRadius: '20px' }}
                        onClick={() => {
                          addItem(name)
                        }}
                      >
                          <Add />
                      </Button>
                      <Button 
                        variant="outlined"
                        size="small"
                        sx={{ 
                          borderRadius: '20px', 
                          color: "red", 
                          borderColor: 'red',
                          '&:hover': {
                            borderColor: 'red',
                            backgroundColor: 'rgba(255, 0, 0, 0.3)', // Optional: Slight red background on hover
                          },
                        }}
                        onClick={() => {
                          removeItem(name)
                        }}
                      >
                          <Delete />
                      </Button>
                    </Stack>
                  </TableCell>
                  <TableCell align="center" sx={{ color: '#E0E0E0' }}>
                    <Typography variant="h6">
                    <b>{quantity}</b>
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  )
}
