'use strict';

/* Controllers */

function InputsController($scope, $http, $log) {

    $scope.velocityModels = ['floris', 'gauss', 'jensen'];
    $scope.deflectionModels = ['gauss_deflection', 'jimenez'];
    $scope.wakeCombinations = ['sosfs'];

	$scope.inputs = {name: 'floris_input_file_Example', type: "floris input", description: 'Example FLORIS Input file'};
    $scope.inputs.farm = {
        type: "farm",
		name: "farm_example_2x2",
        description: "Example Wind Farm",
        properties: {
            wind_speed: 8.0,
            wind_direction: 270.0,
            turbulence_intensity: 0.1,
            wind_shear: 0.12,
            wind_veer: 0.0,
            air_density: 1.225,
            wake_combination: "sosfs",
            layout_x: [],
            layout_y: []
        }
    };
    $scope.inputs.turbine = {
		type: "turbine",
        name: "nrel_5mw",
		description: "NREL 5MW",
		properties: {
            rotor_diameter: 126.0,
			hub_height: 90.0,
			blade_count: 3,
			pP: 1.88,
			pT: 1.88,
			generator_efficiency: 1.0,
			eta: 0.768,
			power_thrust_table: {
                power: [0.0, 0.15643578, 0.31287155, 0.41306749, 0.44895632, 0.46155227, 0.46330747, 0.46316077, 0.46316077, 0.46280642, 0.45223111, 0.39353012, 0.3424487, 0.2979978, 0.25931677, 0.22565665, 0.19636572, 0.17087684, 0.1486965, 0.12939524, 0.11259934, 0.0979836, 0.08526502, 0.07419736, 0.06456631, 0.05618541, 0.04889237, 0.0],
                thrust: [1.10610965, 1.09515807, 1.0227122, 0.9196487, 0.85190470, 0.80328229, 0.76675469, 0.76209299, 0.76209299, 0.75083241, 0.67210674, 0.52188504, 0.43178758, 0.36443258, 0.31049874, 0.26696686, 0.22986909, 0.19961578, 0.17286245, 0.15081457, 0.13146666, 0.11475968, 0.10129584, 0.0880188, 0.07746819, 0.06878621, 0.05977061, 0.0],
                wind_speed: [0.0, 2.5, 3.52338654, 4.57015961, 5.61693268, 6.66370575, 7.71047882, 8.75725189, 9.80402496, 10.85079803, 11.70448774, 12.25970155, 12.84125247, 13.45038983, 14.08842222, 14.75672029, 15.45671974, 16.18992434, 16.95790922, 17.76232421, 18.60489742, 19.48743891, 20.41184461, 21.38010041, 22.39428636, 23.45658122, 24.56926707, 30.0]
            },
            blade_pitch: 1.9,
			yaw_angle: 20.0,
			tilt_angle: 0.0,
			TSR: 8.0
        }
    };

    $scope.inputs.wake = {
        type: "wake",
        name: "wake_default",
        description: "wake",
        properties: {
            velocity_model: "gauss",
            deflection_model: "jimenez",
            parameters: {
                jensen: {
                    we: 0.05
                },
                floris: {
                    me: [
                        -0.05,
                        0.3,
                        1.0
                    ],
                    aU: 12.0,
                    bU: 1.3,
                    mU: [
                        0.5,
                        1.0,
                        5.5
                    ]
                },
                gauss: {
                    ka: 0.38371,
                    kb: 0.004,
                    alpha: 0.58,
                    beta: 0.077
                },
                jimenez: {
                    kd: 0.17,
                    ad: -4.5,
                    bd: -0.01
                },
                gauss_deflection: {
                    alpha: 0.58,
                    beta: 0.077,
                    ad: 0.0,
                    bd: 0.0
                }
            }
        }
	};

  $log.log("INPUTS: ", $scope.inputs);

  $scope.saveFile = function() {

      $log.log("Generating file...");
      // TODO: call a formatting function here to get the file looking like you want
      const config = {headers: {Accept: 'application/json'}};
      $http.post('/generate/', $scope.inputs, config)
          .then(function(response){
              $log.log("RESPONSE: ", response);
              // show success modal
              $('#successModal').modal();

          }, function(error){
              // show error modal
              $('#errorModal').modal();
              if ('data' in error && 'message' in error.data){
                  $scope.error = error.data.message;
              } else {
                  $scope.error = error;
              }

              $log.log(error);
      });
  };

  // add turbine to farm layout
  $scope.addTurbine = function() {
      $scope.inputs.farm.properties.layout_x.push(0);
      $scope.inputs.farm.properties.layout_y.push(0);
  };

  // add entry to power thrust table
  $scope.addEntry = function() {
      $scope.inputs.turbine.properties.power_thrust_table.power.push(0);
      $scope.inputs.turbine.properties.power_thrust_table.thrust.push(0);
      $scope.inputs.turbine.properties.power_thrust_table.wind_speed.push(0);
  };

  // remove row from farm layout table or power thrust table
  $scope.removeEntry = function(type, index) {
      if (type === 'turbine') {
          $scope.inputs.farm.properties.layout_x.splice(index, 1);
          $scope.inputs.farm.properties.layout_y.splice(index, 1);

      } else if (type === 'pt'){
          $scope.inputs.turbine.properties.power_thrust_table.power.splice(index, 1);
          $scope.inputs.turbine.properties.power_thrust_table.thrust.splice(index, 1);
          $scope.inputs.turbine.properties.power_thrust_table.wind_speed.splice(index, 1);
      }
  };
}

