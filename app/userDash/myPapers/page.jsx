"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { paperService } from "../../services";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Button,
  CircularProgress,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import ChildSelectorDropDown from "@/app/Components/Common/ChildSelectorDropDown";
import { formatDateToShortMonth } from "@/app/utils/dateFormat";

export default function MyPapersPage() {
  const { status } = useSession();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedChild, setSelectedChild] = useState("all");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (status !== "authenticated") return;
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await paperService.getMine();
        if (mounted) setItems(res.data || []);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [status]);

  const filtered = useMemo(() => {
    const term = searchText.trim().toLowerCase();
    return (items || [])
      .filter((it) => selectedChild === "all" || it.childId?._id === selectedChild)
      .filter((it) => {
        if (!term) return true;
        const fields = [
          it.paperSetId?.setTitle,
          it.childId?.childName,
          it.invoiceNumber,
          it.status,
          ...(it.selectedPapers || []).map((p) => p.title),
        ]
          .filter(Boolean)
          .map((v) => String(v).toLowerCase());
        return fields.some((f) => f.includes(term));
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [items, selectedChild, searchText]);

  if (status !== "authenticated") return <div>Please login</div>;

  return (
    <Box sx={{ p: { xs: 1, md: 2 } }}>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <Typography color="primary" variant="h5" sx={{ fontFamily: "Courgette" }}>
            My Purchased Papers
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: { xs: "flex-start", md: "flex-end" }, gap: 2, flexWrap: "wrap" }}>
          <ChildSelectorDropDown selectedChild={selectedChild} setSelectedChild={setSelectedChild} />
          <TextField
            size="small"
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>

      {loading ? (
        <Stack alignItems="center" sx={{ py: 5 }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Loading your papers...
          </Typography>
        </Stack>
      ) : filtered.length === 0 ? (
        <Card sx={{ p: 3 }}>
          <Typography variant="body1">No purchases found.</Typography>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {filtered.map((bp) => (
            <Grid item key={bp._id} xs={12} sm={6} md={4}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Stack spacing={1.2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle1" fontWeight={700} color="primary">
                        {bp.paperSetId?.setTitle}
                      </Typography>
                      <Chip
                        label={bp.status}
                        color={bp.status === "succeeded" ? "success" : "default"}
                        size="small"
                        variant="outlined"
                      />
                    </Stack>
                    <Typography variant="body2">
                      Child: <strong>{bp.childId?.childName}</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Purchased: {formatDateToShortMonth(bp.date)}
                    </Typography>
                    {bp.invoiceNumber && (
                      <Typography variant="body2" color="text.secondary">
                        Invoice: {bp.invoiceNumber}
                      </Typography>
                    )}
                    <Typography variant="body2">
                      Papers: {(bp.selectedPapers || []).map((p) => p.title).join(", ") || "-"}
                    </Typography>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 1 }}>
                      <Typography variant="subtitle2">£{Number(bp.amount || 0).toFixed(2)}</Typography>
                      <Button size="small" variant="outlined" href={`/paper/buy/${bp.paperSetId?._id}`} sx={{ textTransform: "none" }}>
                        Buy more
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}





