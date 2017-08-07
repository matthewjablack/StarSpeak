function alert_with_inputfieldsfield(key, value) {
      Materialize.toast(value, 4000)
      $("#"+key+"_field").addClass("animated shake materialize-red lighten-5")
      setTimeout(() => {
      	$("#"+key+"_field").removeClass("animated shake")
      }, 1000)
}