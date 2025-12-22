import React from 'react';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SchoolIcon from '@mui/icons-material/School';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import ParkIcon from '@mui/icons-material/Park';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import PlaceIcon from '@mui/icons-material/Place';
import { COLORS } from '../constants/colors';

export const getAmenityIcon = (type) => {
    const FONT_SIZE = 20;
    const ICON_PROPS = { style: { fontSize: `${FONT_SIZE}px`, color: COLORS.JUNGLE_GREEN  } };
    const AMENITY_ICONS = {
        'restaurant': RestaurantIcon,
        'cafe': LocalCafeIcon,
        'hospital': LocalHospitalIcon,
        'clinic': LocalHospitalIcon,
        'doctors': LocalHospitalIcon,
        'school': SchoolIcon,
        'college': SchoolIcon,
        'university': SchoolIcon,
        'kindergarten': SchoolIcon,
        'fuel': LocalGasStationIcon,
        'bank': AccountBalanceIcon,
        'atm': AccountBalanceIcon,
        'pharmacy': LocalPharmacyIcon,
        'park': ParkIcon,
        'theatre': TheaterComedyIcon,
        'cinema': TheaterComedyIcon,
        'marketplace': ShoppingCartIcon,
        'supermarket': ShoppingCartIcon,
    }
    const IconComponent = AMENITY_ICONS[type] || PlaceIcon;
    return React.createElement(IconComponent, ICON_PROPS);
};

