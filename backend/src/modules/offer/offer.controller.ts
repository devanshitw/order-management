import { Controller, Get } from '@nestjs/common';
import { OfferService } from './offer.service';
import { responseMessage } from 'src/common/utils/response.message';

@Controller('offers')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @Get()
  async getActiveOffers() {
    const offers = await this.offerService.getActiveOffers();
    return {
      message: responseMessage.OFFER.FETCHED,
      offers,
    };
  }
}
