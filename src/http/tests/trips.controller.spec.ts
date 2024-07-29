import { Test, TestingModule } from "@nestjs/testing";
import { TripsController } from "../controllers/trip.controller";
import { TripsService } from "../services/trip.service";

describe("TripsController", () => {
  let controller: TripsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TripsController],
      providers: [TripsService],
    }).compile();

    controller = module.get<TripsController>(TripsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
