import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Breadcrumbs, Typography } from '@mui/material';
import Link from 'next/link';

interface BreadcrumbItems {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItems[];
}

export default function Breadcrumb({ items }: BreadcrumbsProps) {
  return (
    <Breadcrumbs
      separator={
        <ChevronRightIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
      }
      sx={{ mb: 2 }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        if (isLast || !item.href) {
          return (
            <Typography key={item.label} variant="body2" color="text.primary">
              {item.label}
            </Typography>
          );
        }

        return (
          <Typography
            key={item.label}
            component={Link}
            href={item.href}
            variant="body2"
            sx={{
              color: 'text.secondary',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
                color: 'text.primary',
              },
            }}
          >
            {item.label}
          </Typography>
        );
      })}
    </Breadcrumbs>
  );
}
