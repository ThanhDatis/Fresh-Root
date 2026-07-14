import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

export default function Loading() {
  return (
    <Box sx={{ minHeight: '100dvh' }}>
      <Skeleton variant="rectangular" height={4} sx={{ width: '100%' }} />

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Stack spacing={3}>
          <Skeleton variant="text" width="40%" height={40} />
          <Skeleton variant="text" width="60%" />

          <Stack
            direction="row"
            // flexWrap="wrap"
            sx={{ mt: 2, gap: 2, flexWrap: 'wrap' }}
            useFlexGap
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="rounded" width={220} height={160} />
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
