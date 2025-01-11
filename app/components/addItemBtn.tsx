import { useState, useEffect } from "react";
import { usePlaidLink } from 'react-plaid-link'
import { Button } from "./ui/button";
import { Car } from "lucide-react";
import { useNavigate, useNavigation } from "react-router";

export default function AddInstitutionButton() {
  const [linkToken, setLinkToken]= useState<string | null>(null);
  const navigate = useNavigate()
  
  useEffect(() => {
    const fetchLink = async () => {
      const response = await fetch(`${import.meta.env.VITE_NETLY_HOST}/api/public_token`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json() as { link_token: string }
      
      setLinkToken(data.link_token)
    }
    fetchLink()
  }, [])
  
  
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token, metadata) => {
      const response = await fetch(`${import.meta.env.VITE_NETLY_HOST}/api/link_token`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({public_token, metadata})
      })
      
      if(response.ok) {
        // Navigate to the current route to refresh the page
        navigate(".", { replace: true });
      }
    },
    onExit: (err, metadata) => {
      console.log(err)
    }
  })
  
  return (
    <Button
      variant="outline"
      className="mb-8 flex items-center space-x-2 text-gray-900 hover:text-gray-800 border-gray-300 hover:border-gray-400 transition-all duration-200"
      onClick={() =>  open()}
      disabled={!ready}
    >
      <Car className="h-5 w-5" />
      <span className="font-medium">Add Institution</span>
    </Button>
  )
}