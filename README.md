
button design : 

       <Button 
            onClick={() => setOpenBatchModal(false)}
            sx={{ 
              color: 'white', 
              backgroundColor: 'red', 
              '&:hover': { backgroundColor: 'darkred' },
              flex: 1,
              marginRight: '8px'
            }}
          >
            Close
          </Button>
          <Link href={"/mockTest/buy/" + data._id} style={{ flex: 1 }}>
            <Button 
              onClick={() => setOpenBatchModal(false)}
              sx={{ 
                color: 'white', 
                backgroundColor: 'green', 
                '&:hover': { backgroundColor: 'darkred' },
                width: '100%'
              }}
            >
              Buy Now
            </Button>
          </Link>





